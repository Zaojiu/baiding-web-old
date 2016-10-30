import {Component, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {WechatService} from "../../../shared/wechat/wechat.service";
import {WechatAudioModel} from "../../../shared/wechat/wechat.model";
import {RecordStatus} from "./recorder.enums";

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
  @Output() recordEnd = new EventEmitter<WechatAudioModel>();

  constructor(private wechatService: WechatService) {
  }

  startRecord() {
    if (this.status !== RecordStatus.Waitting) return;

    this.status = RecordStatus.Preparing;

    this.wechatService.startRecord().then(()=> {
      if (this.status !== RecordStatus.Preparing) {
        setTimeout(() => {
          this.wechatService.cancelRecord();
          this.status = RecordStatus.Waitting;
        }, 1000);
        return;
      }

      this.status = RecordStatus.Recording;
      this.recordDuration = 0;
      this.timer = setInterval(() => {
        this.recordDuration++
      }, 100);
      this.autoComplete();
    }).catch((reason) => {
      this.status = RecordStatus.Waitting;
    });
  }

  autoComplete() {
    this.wechatService.autoCompelete().then(localId => {
      this.wechatService.processVoice(localId).then(audioModel => {
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
        this.wechatService.cancelRecord().finally(() => {
          setTimeout(() => this.status = RecordStatus.Waitting, 1000);
        });
      } else {
        let millisecond = this.recordDuration * 100;

        this.status = RecordStatus.Uploading;

        this.wechatService.stopRecord(millisecond).then(audioModel => {
          this.recordEnd.emit(audioModel);
        }).finally(() => {
          // 停止成功或失败, 都要重置状态
          this.status = RecordStatus.Waitting;
        });
      }
    }
  }

  cancelRecord() {
    if (this.timer) clearInterval(this.timer);

    if (this.status !== RecordStatus.Recording) return;

    this.status = RecordStatus.Canceled;

    this.wechatService.cancelRecord().finally(() => {
      setTimeout(() => this.status = RecordStatus.Waitting, 1000);
    });
  }
}
