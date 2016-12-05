import {Component, Input} from '@angular/core';
import {UserInfoModel} from '../api/user-info/user-info.model';
import {Router} from '@angular/router';

@Component({
  selector: 'hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
})

export class HamburgerMenuComponent {
  activeStatus = false;
  @Input() liveId: string;
  @Input() from: string;
  @Input() userInfo: UserInfoModel;

  constructor(private router: Router) {
  }

  switch() {
    return this.activeStatus = !this.activeStatus;
  }

  createRoom() {
    let from = this.liveId ? {from: encodeURIComponent(`/lives/${this.liveId}`)} : this.from ? {from: this.from} : null;
    if (this.userInfo.canPublish) {
      this.router.navigate([`/lives/create`, from]);
    } else {
      this.router.navigate([`/lives/apply`, from]);
    }
  }

  gotoMyRoomList() {
    this.router.navigate([`/info-center`]);
  }
}
