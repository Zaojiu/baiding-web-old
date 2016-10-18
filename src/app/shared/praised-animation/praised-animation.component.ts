import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as _random from 'lodash/random';

import { UserInfoService } from '../api/user-info/user-info.service';
import { UserAnimEmoji } from './praised-animation.model';


@Component({
  selector: 'praised-animation',
  templateUrl: './praised-animation.component.html',
  styleUrls: ['./praised-animation.component.scss'],
})

export class PraisedAnimationComponent implements OnInit {
  @Input() userAnim: UserAnimEmoji;
  randomAnimation: number;
  randomXAxisOffset: number;
  isMine: boolean;

  constructor(private sanitizer: DomSanitizer, private userInfoService: UserInfoService) {}

  ngOnInit() {
    this.randomAnimation = _random(0, 1, false);
    this.randomXAxisOffset = _random(10, 44, false);
    let userInfo = this.userInfoService.getUserInfoCache();
    this.isMine = this.userAnim.user.uid === userInfo.uid;
  }

  getXAxisOffset() {
    return this.sanitizer.bypassSecurityTrustStyle(this.randomXAxisOffset + 'px');
  }
}
