import {Component, Output, EventEmitter} from '@angular/core';
import {RecordStatus} from './recorder.enums';
import {AudioBridge} from "../../../shared/bridge/audio.interface";
import {RecorderData} from "./recorder.models";
import {OperationTipsService} from "../../../shared/operation-tips/operation-tips.service";
import {UtilsService} from "../../../shared/utils/utils";

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
  maxRecordDuration = 600;
  @Output() recordEnd = new EventEmitter<RecorderData>();
  @Output() recording = new EventEmitter<number>();

  constructor(private audioBridge: AudioBridge, private operationTips: OperationTipsService) {
  }

  startRecord() {
    if (this.status !== RecordStatus.Waitting) return;

    this.status = RecordStatus.Preparing;

    this.audioBridge.startRecord().then(() => {
      if (this.status !== RecordStatus.Preparing) {
        setTimeout(() => {
          this.status = RecordStatus.Waitting;

          this.audioBridge.cancelRecord();
        }, 1000);
        return;
      }

      this.status = RecordStatus.Recording;
      this.recordDuration = 0;
      this.timer = setInterval(() => {
        this.recordDuration++;
        this.recording.emit(this.recordDuration);
      }, (UtilsService.isiOS ? 96 : 98));
      this.autoComplete();
    }, (err) => {
      if (err && err.name === 'PermissionDeniedError') {
        this.operationTips.popup('请开启录音权限');
      } else {
        this.operationTips.popup('录音失败');
      }
      this.status = RecordStatus.Waitting;
    });
  }

  autoComplete() {
    this.audioBridge.autoCompelete().then(result => {
      let millisecond = this.maxRecordDuration * 100;
      let recorderData: RecorderData;

      if (typeof(result) === 'string') {
        recorderData = new RecorderData(result as string, null, millisecond);
      } else {
        recorderData = new RecorderData('', result as Blob, millisecond);
      }

      this.recordEnd.emit(recorderData);
    }).finally(() => {
      this.status = RecordStatus.Waitting;
      // 自动完成了, 那么重置状态。
      if (this.timer) clearInterval(this.timer);
    });
  }

  stopRecord() {
    if (this.timer) clearInterval(this.timer);

    if (this.status === RecordStatus.Preparing) {
      // 防止误点, 录音未开始就调用结束。
      this.status = RecordStatus.TooShort;

    } else if (this.status === RecordStatus.ReadyToCancel) {

      this.cancelRecord();

    } else if (this.status === RecordStatus.Recording) {

      if (this.recordDuration < this.minRecordDuration) {
        // 防止录音太短听不清。
        this.status = RecordStatus.TooShort;

        setTimeout(() => {
          this.status = RecordStatus.Waitting;

          this.audioBridge.cancelRecord();
        }, 1000);

      } else {

        this.status = RecordStatus.Uploading;

        this.audioBridge.stopRecord().then(result => {
          let millisecond = this.recordDuration * 100;
          let recorderData: RecorderData;

          if (typeof(result) === 'string') {
            recorderData = new RecorderData(result as string, null, millisecond);
          } else {
            recorderData = new RecorderData('', result as Blob, millisecond);
          }

          this.recordEnd.emit(recorderData);
        }).finally(() => {
          // 停止成功或失败, 都要重置状态
          this.status = RecordStatus.Waitting;
        });
      }
    }
  }

  cancelRecord() {
    if (this.timer) clearInterval(this.timer);

    if (this.status !== RecordStatus.ReadyToCancel) return;

    this.status = RecordStatus.Canceled;

    this.audioBridge.cancelRecord().finally(() => {
      setTimeout(() => {
        this.status = RecordStatus.Waitting;
      }, 1000);
    });
  }

  get recordCountDown(): number {
    let countdown = Math.round((this.maxRecordDuration - this.recordDuration) / 10);
    return countdown > 0 ? countdown : 0;
  }
}
