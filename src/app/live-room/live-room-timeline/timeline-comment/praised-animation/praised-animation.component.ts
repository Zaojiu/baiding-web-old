import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';
import { UserInfoService } from '../../../../shared/user-info/user-info.service';
import { PraisedUserModel } from '../timeline-comment.model'

declare var _: any;

@Component({
  selector: 'praised-animation',
  templateUrl: './praised-animation.component.html',
  styleUrls: ['./praised-animation.component.scss'],
})

export class PraisedAnimationComponent implements OnInit {
  @Input() user: PraisedUserModel;
  randomAnimation: number;
  randomXAxisOffset: number;
  isMine: boolean;

  constructor(private sanitizer: DomSanitizationService, private userInfoService: UserInfoService) {}

  ngOnInit() {
    this.randomAnimation = _.random(0, 1, false);
    this.randomXAxisOffset = _.random(10, 44, false);
    this.userInfoService.getUserInfo().then(userInfo => {
      this.isMine = this.user.uid === userInfo.uid;
    })
  }

  getXAxisOffset() {
    return this.sanitizer.bypassSecurityTrustStyle(this.randomXAxisOffset + 'px');
  }
}
