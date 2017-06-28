import {Component, Input, AfterViewInit, ViewChild} from '@angular/core';
import {UserInfoModel} from '../api/user-info/user-info.model';
import {Router} from '@angular/router';
import {AutoOpacityDownDirective} from "../animation/auto-opacity-down/auto-opacity-down.directive";
import {AuthBridge} from "../bridge/auth.interface";

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

  constructor(private router: Router, private authService: AuthBridge) {}

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

  gotoSignin() {
    this.authService.auth('/');
  }

  createRoom() {
    if (!this.userInfo) {
      this.gotoSignin();
      return;
    }

    let from = this.liveId ? {from: `lives/${this.liveId}`} : this.from ? {from: this.from} : {from: `info-center/${this.userInfo.uid}`};

    if (this.userInfo.canPublish) {
      this.router.navigate([`/lives/create`, from]);
    } else {
      this.router.navigate([`/lives/apply`, from]);
    }

    this.switch();
  }

  gotoInfoCenter() {
    if (!this.userInfo) {
      this.gotoSignin();
      return;
    }

    this.router.navigate([`/info-center/${this.userInfo.uid}`]);

    this.switch();
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
