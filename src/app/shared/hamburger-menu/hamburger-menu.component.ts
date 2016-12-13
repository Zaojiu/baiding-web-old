import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {UserInfoModel} from '../api/user-info/user-info.model';
import {Router} from '@angular/router';
import {AutoOpacityDownDirective} from "../animation/auto-opacity-down/auto-opacity-down.directive";

@Component({
  selector: 'hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
})

export class HamburgerMenuComponent implements OnInit {
  activeStatus = false;
  @Input() liveId: string;
  @Input() from: string;
  @Input() userInfo: UserInfoModel;
  @ViewChild(AutoOpacityDownDirective) autoFade: AutoOpacityDownDirective;

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      if (this.autoFade) this.autoFade.opacityDown();
    }, 2000);
  }

  switch() {
    if (!this.activeStatus) {
      this.autoFade.opacityUp();
    }
    else {
      this.autoFade.opacityDown();
    }

    return this.activeStatus = !this.activeStatus;
  }

  createRoom() {
    let from = this.liveId ? {from: encodeURIComponent(`/lives/${this.liveId}`)} : this.from ? {from: this.from} : {from: encodeURIComponent('/info-center')};
    if (this.userInfo && this.userInfo.canPublish) {
      this.router.navigate([`/lives/create`, from]);
    } else {
      this.router.navigate([`/lives/apply`, from]);
    }
  }

  gotoMyRoomList() {
    this.router.navigate([`/info-center`]);
  }

  dragStart() {
    this.autoFade.opacityUp();
  }

  dragEnd() {
    this.autoFade.opacityDown();
  }
}
