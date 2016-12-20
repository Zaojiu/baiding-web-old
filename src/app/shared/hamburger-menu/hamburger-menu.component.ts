import {Component, Input, AfterViewInit, ViewChild} from '@angular/core';
import {UserInfoModel} from '../api/user-info/user-info.model';
import {Router} from '@angular/router';
import {AutoOpacityDownDirective} from "../animation/auto-opacity-down/auto-opacity-down.directive";

@Component({
  selector: 'hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
})

export class HamburgerMenuComponent implements AfterViewInit {
  isActivated = false;
  @Input() liveId: string;
  @Input() from: string;
  @Input() userInfo: UserInfoModel;
  @ViewChild(AutoOpacityDownDirective) autoFade: AutoOpacityDownDirective;
  timer: any;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.autoFade) this.autoFade.opacityDown();
    }, 2000);
  }

  switch() {
    if (this.timer) clearTimeout(this.timer);

    if (!this.isActivated) {
      this.autoFade.opacityUp()
    }
    else {
      this.timer = setTimeout(() => {
        this.autoFade.opacityDown();
      }, 3000)
    }

    return this.isActivated = !this.isActivated;
  }

  createRoom() {
    let from = this.liveId ? {from: encodeURIComponent(`/lives/${this.liveId}`)} : this.from ? {from: this.from} : {from: encodeURIComponent(`/info-center/${this.userInfo.uid}`)};
    if (this.userInfo && this.userInfo.canPublish) {
      this.router.navigate([`/lives/create`, from]);
    } else {
      this.router.navigate([`/lives/apply`, from]);
    }
  }

  gotoInfoCenter() {
    this.router.navigate([`/info-center/${this.userInfo.uid}`]);
  }

  dragStart() {
    if (this.timer) clearTimeout(this.timer);
    this.autoFade.opacityUp();
  }

  dragEnd() {
    this.timer = setTimeout(() => {
      this.autoFade.opacityDown();
    }, 3000)
  }
}
