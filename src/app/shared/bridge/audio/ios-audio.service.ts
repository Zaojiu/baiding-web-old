import {Injectable} from '@angular/core';
import {AudioBridge} from "../audio.interface";
import {IosBridgeService} from "../../ios-bridge/ios-bridge.service";
import {RecordFailedType, RecordStopedType} from "./ios-audio.enums";

@Injectable()
export class IosAudioService implements AudioBridge {
  playingVoiceId: string;

  private recordStopSuccessfulResolver: (audioData: Blob) => void;
  private recordCancelSuccessfulResolver: () => void;
  private recordAutoCompleteSuccessfulResolver: (audioData: Blob) => void;
  private recordStartFailedRejecter: () => void;
  private recordStopFailedRejecter: () => void;
  private recordCancelFailedRejecter: () => void;
  private recordAutoCompleteFailedRejecter: () => void;
  private maxDuration = 60;
  private stopType: RecordStopedType;

  constructor(private iosBridgeService: IosBridgeService) {
  }

  private _startRecord(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.recordStartFailedRejecter = reject;

      this.iosBridgeService.bridge.callHandler('record', {duration: this.maxDuration}, (result) => {
        // 结束成功回调,包含自动结束,手动结束
        if (this.stopType === RecordStopedType.Manual && this.recordStopSuccessfulResolver) {
          this.recordStopSuccessfulResolver(result);
        }

        if (this.stopType === RecordStopedType.Auto && this.recordAutoCompleteSuccessfulResolver) {
          this.recordAutoCompleteSuccessfulResolver(result);
        }

        if (this.stopType === RecordStopedType.Cancel && this.recordCancelSuccessfulResolver) {
          this.recordCancelSuccessfulResolver();
        }
      }, (failedType: RecordFailedType) => {
        // 失败回调,包含开始录音失败, 结束录音失败

        if (failedType === RecordFailedType.StartFailed && this.recordStartFailedRejecter) {
          this.recordStartFailedRejecter();
        }

        if (failedType === RecordFailedType.StopFailed && this.stopType === RecordStopedType.Manual && this.recordStopFailedRejecter) {
          this.recordStopFailedRejecter();
        }

        if (failedType === RecordFailedType.StopFailed && this.stopType === RecordStopedType.Auto && this.recordAutoCompleteFailedRejecter) {
          this.recordAutoCompleteFailedRejecter();
        }

        if (failedType === RecordFailedType.StopFailed && this.stopType === RecordStopedType.Cancel && this.recordCancelFailedRejecter) {
          this.recordAutoCompleteFailedRejecter();
        }
      }, () => {
        this.stopType = RecordStopedType.Auto;
        resolve();
      });
    })
  }

  startRecord(): Promise<void> {
    if (!this.iosBridgeService.hasInit) {
      return this.iosBridgeService.init().then(() => {
        return this._startRecord();
      });
    } else {
      return this._startRecord();
    }
  }

  autoCompelete(): Promise<Blob> {
    if (!this.iosBridgeService.hasInit) {
      return this.iosBridgeService.init().then(() => {
        return new Promise((resolve, reject) => {
          this.recordAutoCompleteSuccessfulResolver = resolve;
          this.recordAutoCompleteFailedRejecter = reject;
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.recordAutoCompleteSuccessfulResolver = resolve;
        this.recordAutoCompleteFailedRejecter = reject;
      });
    }

  }

  private _stopRecord(): Promise<Blob> {
    this.stopType = RecordStopedType.Manual;

    return new Promise((resolve, reject) => {
      this.recordStopSuccessfulResolver = resolve;
      this.recordStopFailedRejecter = reject;
      this.iosBridgeService.bridge.callHandler('stopRecord');
    });
  }

  stopRecord(): Promise<Blob> {
    if (!this.iosBridgeService.hasInit) {
      return this.iosBridgeService.init().then(() => {
        return this._stopRecord();
      });
    } else {
      return this._stopRecord();
    }
  }

  private _cancelRecord(): Promise<void> {
    this.stopType = RecordStopedType.Cancel;

    return new Promise((resolve, reject) => {
      this.recordCancelSuccessfulResolver = resolve;
      this.recordCancelFailedRejecter = reject;
      this.iosBridgeService.bridge.callHandler('stopRecord');
    });
  }

  cancelRecord(): Promise<void> {
    if (!this.iosBridgeService.hasInit) {
      return this.iosBridgeService.init().then(() => {
        return this._cancelRecord();
      });
    } else {
      return this._cancelRecord();
    }
  }

  // ios不需用到app播放音频。
  playVoice(id: string): Promise<string> {
    return Promise.resolve('');
  }

  // ios不需用到app播放音频。
  stopVoice(id: string) {
    return;
  }

  // ios不需用到app上传音频。
  uploadVoice(data: string): Promise<string> {
    return Promise.resolve('');
  }
}
