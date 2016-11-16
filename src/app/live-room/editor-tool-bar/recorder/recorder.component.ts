import {Component, Output, EventEmitter} from '@angular/core';
import {RecordStatus} from './recorder.enums';
import {AudioBridge} from "../../../shared/bridge/audio.interface";
import {AudioModel} from "../../../shared/bridge/audio.model";

@Component({
  selector: 'recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss'],
})

export class RecorderComponent {
  status: RecordStatus = RecordStatus.Waitting;
  recordStatusEnum = RecordStatus;
  timer: any;
  recordDuration: number = 0;
  minRecordDuration = 10;
  @Output() recordEnd = new EventEmitter<AudioModel>();

  constructor(private audioBridge: AudioBridge) {
  }

  startRecord() {
    if (this.status !== RecordStatus.Waitting) return;

    this.status = RecordStatus.Preparing;

    this.audioBridge.startRecord().then(() => {
      if (this.status !== RecordStatus.Preparing) {
        setTimeout(() => {
          this.audioBridge.cancelRecord();
          this.status = RecordStatus.Waitting;
        }, 1000);
        return;
      }

      this.status = RecordStatus.Recording;
      this.recordDuration = 0;
      this.timer = setInterval(() => {
        this.recordDuration++;
      }, 100);
      this.autoComplete();
    }).catch((reason) => {
      this.status = RecordStatus.Waitting;
    });
  }

  autoComplete() {
    this.audioBridge.autoCompelete().then(localId => {
      Promise.all([this.audioBridge.translateVoice(localId), this.audioBridge.uploadVoice(localId)]).then(result => {
        let translateResult = result[0] || '';
        let serverId = result[1];
        var audioModel = new AudioModel();
        audioModel.localId = localId;
        audioModel.serverId = serverId;
        audioModel.translateResult = translateResult;
        audioModel.duration = 60 * 1000;

        this.recordEnd.emit(audioModel);
      }, (err) => {
        // TODO: error handler;
        console.log(err);
      }).finally(() => {
        this.status = RecordStatus.Waitting;
      });
    }).finally(() => {
      this.status = RecordStatus.Uploading;
      // 自动完成了, 那么重置状态。
      if (this.timer) clearInterval(this.timer);
    });
  }

  stopRecord() {
    if (this.status === RecordStatus.Preparing) {
      // 防止误点, 录音未开始就调用结束。
      this.status = RecordStatus.TooShort;
    } else if (this.status === RecordStatus.Recording) {
      if (this.timer) clearInterval(this.timer);

      if (this.recordDuration < this.minRecordDuration) {
        // 防止录音太短听不清。
        this.status = RecordStatus.TooShort;
        this.audioBridge.cancelRecord().finally(() => {
          setTimeout(() => this.status = RecordStatus.Waitting, 1000);
        });
      } else {
        let millisecond = this.recordDuration * 100;

        this.status = RecordStatus.Uploading;

        this.audioBridge.stopRecord(millisecond).then(audioModel => {
          this.recordEnd.emit(audioModel);
        }).finally(() => {
          // 停止成功或失败, 都要重置状态
          this.status = RecordStatus.Waitting;
        });
      }
    }
  }

  panup(e) {
    if (e.distance > 50) {
      this.cancelRecord();
    }
  }

  cancelRecord() {
    if (this.timer) clearInterval(this.timer);

    if (this.status !== RecordStatus.Recording) return;

    this.status = RecordStatus.Canceled;

    this.audioBridge.cancelRecord().finally(() => {
      setTimeout(() => this.status = RecordStatus.Waitting, 1000);
    });
  }
}
