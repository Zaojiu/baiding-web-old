import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';

import {InputtingMessageModel} from '../../../shared/api/message/message.model';
import {UserInfoModel} from '../../../shared/api/user-info/user-info.model';
import {LiveInfoModel} from '../../../shared/api/live/live.model';
import {InputtingService} from './inputting.service'


@Component({
  selector: 'inputting',
  templateUrl: './inputting.component.html',
  styleUrls: ['./bubble.component.scss'],
})

export class InputtingComponent implements OnInit, OnDestroy {

  @Input() userInfo: UserInfoModel;
  @Input() liveInfo: LiveInfoModel;
  @Output() onshow = new EventEmitter();

  message: InputtingMessageModel;
  private sub = null;

  constructor(private  inputtingService: InputtingService) {
  }

  ngOnInit() {

    let timer = null;
    this.sub = this.inputtingService.actived$
      .throttleTime(5000)
      .filter(e => {
        if (!this.userInfo) {
          return true;
        }
        return e.user.uid !== this.userInfo.uid;
      })
      .subscribe((m: InputtingMessageModel) => {
        this.message = m;
        this.onshow.emit();
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          this.message = null;
        }, 10000);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  hide() {
    this.message = null;
  }
}
