import {Injectable} from '@angular/core';
import {AudioBridge} from "../audio.interface";

@Injectable()
export class PcAudioService implements AudioBridge {
  playingVoiceId: string;
  rtcRecorder: any;
  AMR: any;
  ctx = new AudioContext();
  hasInit = false;

  private recordAutoCompleteSuccessfulResolver: (audioData: Blob) => void;
  private recordAutoCompleteFailedRejecter: () => void;
  private maxDuration = 60;

  constructor() {
  }
  
  private init(): Promise<void> {
    if (!(<any>window).navigator.mediaDevices) {
      (<any>window).navigator.mediaDevices = {};
    }

    if (!(<any>window).navigator.mediaDevices.getUserMedia) {
      (<any>window).navigator.mediaDevices.getUserMedia = function (constraints) {

        var getUserMedia = ((<any>window).navigator.getUserMedia ||
        (<any>window).navigator.webkitGetUserMedia ||
        (<any>window).navigator.mozGetUserMedia);

        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }

    return new Promise((resolve, reject) => {
      (<any>window).navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        System.import('./amr.js').then((amr) => {
          this.AMR = amr;
          return System.import('recordrtc');
        }, (err) => {
          reject(err);
        }).then((recordrtc) => {
          this.rtcRecorder = recordrtc(stream, {
            type: 'audio',
            mimeType: 'audio/ogg',
            audioBitsPerSecond: 128000,
          });
          this.hasInit = true;
          resolve();
        }, (err) => {
          reject(err);
        });
      }, (err) => {
        reject(err);
      });
    });

  }

  private _startRecord(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.rtcRecorder.setRecordingDuration(this.maxDuration * 1000).onRecordingStopped(() => {
        if (this.recordAutoCompleteSuccessfulResolver) this.recordAutoCompleteSuccessfulResolver(this.rtcRecorder.getBlob());
      });

      this.rtcRecorder.startRecording();
      resolve();
    });
  }

  startRecord(): Promise<void> {
    if (!this.hasInit) {
      return this.init().then(() => {
        return this._startRecord();
      });
    } else {
      return this._startRecord();
    }
  }

  autoCompelete(): Promise<Blob> {
    if (!this.hasInit) {
      return this.init().then(() => {
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
    return new Promise((resolve, reject) => {
      this.rtcRecorder.stopRecording(() => {
        resolve(this.rtcRecorder.getBlob());
      });
    });
  }

  stopRecord(): Promise<Blob> {
    if (!this.hasInit) {
      return this.init().then(() => {
        return this._stopRecord();
      });
    } else {
      return this._stopRecord();
    }
  }

  private _cancelRecord(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.rtcRecorder.stopRecording(() => {
        resolve();
      });
    });
  }

  cancelRecord(): Promise<void> {
    if (!this.hasInit) {
      return this.init().then(() => {
        return this._cancelRecord();
      });
    } else {
      return this._cancelRecord();
    }
  }

  private encodeAmr(audio: Blob): Promise<Blob> {
    return new Promise((resolve, reject)=> {
      let reader = new FileReader();
      reader.onload = (e) => {
        let data = new Uint8Array(e.target['result']);

        this.ctx.decodeAudioData(data.buffer, (audioBuffer) => {
          let pcm = null;

          if (audioBuffer['copyFromChannel']) {
            pcm = new Float32Array(audioBuffer.length);
            audioBuffer['copyFromChannel'](pcm, 0, 0);
          } else {
            pcm = audioBuffer.getChannelData(0);
          }

          var amr = this.AMR.encode(pcm, audioBuffer.sampleRate, 7);
          let encodeBlob = new Blob([amr], {type: 'audio/amr'});

          resolve(encodeBlob);
        }, () => {
          reject();
        });
      };
      reader.readAsArrayBuffer(audio);
    });
  }

  // pc不需用到app播放音频。
  playVoice(id: string): Promise<string> {
    return Promise.resolve('');
  }

  // pc不需用到app播放音频。
  stopVoice(id: string) {
    return;
  }

  // pc不需用到app上传音频。
  uploadVoice(data: string): Promise<string> {
    return Promise.resolve('');
  }

  encodeVoice(data: Blob): Promise<Blob> {
    return this.encodeAmr(data);
  }
}
