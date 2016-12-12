import {Component, Input, OnInit, ViewChildren, QueryList, OnDestroy} from '@angular/core';
import {UserInfoModel} from '../api/user-info/user-info.model';
import {Router} from '@angular/router';
import {Subscription} from "rxjs";
import {TimelineService} from "../../live-room/timeline/timeline.service";
import {FadeDirective} from "../animation/fade/fade.directive";
import {AutoOpacityDownDirective} from "../animation/auto-opacity-down/auto-opacity-down.directive";

@Component({
  selector: 'hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
})

export class HamburgerMenuComponent implements OnInit,OnDestroy {
  activeStatus = false;
  @Input() liveId: string;
  @Input() from: string;
  @Input() userInfo: UserInfoModel;
  @ViewChildren(AutoOpacityDownDirective) hamburgerMenu: QueryList<AutoOpacityDownDirective>;
  timelineScrollSub: Subscription;

  constructor(private router: Router, private timelineService: TimelineService) {
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.hamburgerMenu) this.hideHamburger();
    }, 8000);

    this.timelineScrollSub = this.timelineService.scroll$.subscribe((e) => {
      this.showHamburger()
    })
  }

  ngOnDestroy() {
    this.timelineScrollSub.unsubscribe();
  }

  switch() {
    this.hamburgerMenu.first.opacityUp();
    return this.activeStatus = !this.activeStatus;
  }

  showHamburger() {
    this.hamburgerMenu.first.opacityUp();

    setTimeout(() => {
      if (this.hamburgerMenu) this.hideHamburger();
    }, 6000);
  }

  hideHamburger() {
    this.hamburgerMenu.first.opacityDown();
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

  pressToDrag(e: any) {
    console.log(e, 'helo')
  }
}
