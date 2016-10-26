import {Component, Output, EventEmitter} from '@angular/core';
import {WechatService} from "../../../shared/wechat/wechat.service";
import {WechatAudioModel} from "../../../shared/wechat/wechat.model";

@Component({
  selector: 'recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss'],
})

export class RecorderComponent {
  isRecording: boolean;
  isCanceled: boolean;
  isTooShort: boolean;
  timer: any;
  recordDuration: number;
  minRecordDuration = 20;
  @Output() recordEnd = new EventEmitter<WechatAudioModel>();

  constructor(private wechatService: WechatService) {
  }

  startRecord() {
    if (this.isRecording) return;

    this.isRecording = true;
    this.isCanceled = false;
    this.isTooShort = false;

    this.wechatService.startRecord().then(()=>{
      this.recordDuration = 0;
      this.timer = setInterval(() => {
        this.recordDuration++
      }, 100);

      this.wechatService.autoCompelete().then(audioModel => {
        if (this.timer) clearInterval(this.timer);
        this.isRecording = false;
        this.recordEnd.emit(audioModel);
      });
    });
  }

  stopRecord() {
    if (this.timer) clearInterval(this.timer);

    if (!this.isRecording || this.isCanceled || this.isTooShort) return;

    if (this.recordDuration < this.minRecordDuration) {
      this.isRecording = false;
      this.isTooShort = true;
      this.wechatService.cancelRecord();
      this.showRecordCancelTips();
    } else {
      let millisecond = this.recordDuration * 100;
      this.wechatService.stopRecord(millisecond).then(audioModel => {
        this.isRecording = false;
        this.recordEnd.emit(audioModel);
      });
    }
  }

  cancelRecord() {
    if (this.timer) clearInterval(this.timer);

    if (!this.isRecording || this.isCanceled || this.isTooShort) return;

    this.isRecording = false;
    this.isCanceled = true;
    this.showRecordCancelTips();
    this.wechatService.cancelRecord();
  }

  showRecordCancelTips() {
    this.timer = setTimeout(() => {
      this.isCanceled = false;
      this.isTooShort = false;
    }, 1000);
  }
}
