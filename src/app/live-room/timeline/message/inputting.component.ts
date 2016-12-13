import {Component, Input, OnInit, OnDestroy} from '@angular/core';

import {InputtingMessageModel} from '../../../shared/api/message/message.model';
import {UserInfoModel} from '../../../shared/api/user-info/user-info.model';
import {LiveInfoModel} from '../../../shared/api/live/live.model';
import {InputtingService} from './inputting.service'


@Component({
  selector: 'inputting',
  templateUrl: './inputting.component.html',
  styleUrls: ['./message.component.scss'],
})

export class InputtingComponent implements OnInit, OnDestroy {

  @Input() userInfo: UserInfoModel;
  @Input() liveInfo: LiveInfoModel;

  message: InputtingMessageModel;
  private sub = null;

  constructor(private  inputtingService: InputtingService) {
  }

  ngOnInit() {

    this.sub = this.inputtingService.actived$
      .throttleTime(5000)
      .subscribe((m: InputtingMessageModel) => {
        this.message = m;
        setTimeout(() => {
          this.message = null;
        }, 5000);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
