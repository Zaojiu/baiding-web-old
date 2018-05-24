import {Component, OnInit, OnDestroy, AfterViewChecked} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../../shared/api/live/live.service";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {UtilsService} from "../../shared/utils/utils";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {appConfig, environment, host} from "../../../environments/environment";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {CustomHttp} from "../../shared/api/custom-http.service";


@Component({
  templateUrl: './changsanjiao.component.html',
  styleUrls: ['./changsanjiao.component.scss'],
})

export class ChangSanJiaoComponent implements OnInit, OnDestroy, AfterViewChecked {
  topLiveInfo: LiveInfoModel;
  livesList: LiveInfoModel[] = [];
  timeNow = UtilsService.now.toString();
  liveTime: { [liveId: string]: string } = {};
  timer: any;
  userInfo: UserInfoModel;
  qrcode: string;
  liveId: string;
  from = '/lives';
  isInApp = UtilsService.isInApp;
  isInWechat = UtilsService.isInWechat;
  isLoading = false;
  booking = false;
  isQrcodeShown = false;
  isSubscribeLinkLoading = false;
  isSubscribeLinkError = false;
  liveIdList = ['5b04b1ec898ce900017b5dfd', '5b04b21f9871e7000129a97b', '5b04b2389871e7000129a97d', '5b04b2509871e7000129a97f', '5b04b26d9871e7000129a981'];
  // liveIdList = ['5a03dc8b7bed47000100ca7c', '5a03dc8b7bed47000100ca7c', '5a03dc8b7bed47000100ca7c', '5a03dc8b7bed47000100ca7c', '5a03dc8b7bed47000100ca7c'];

  constructor (private router: Router, private route: ActivatedRoute, private liveService: LiveService,
               private operationTipsService: OperationTipsService, private http: CustomHttp,
               private sanitizer: DomSanitizer, private userInfoService: UserInfoService) {
  }

  ngOnInit () {
    this.topLiveInfo = this.route.snapshot.data['topLiveInfo'];
    this.userInfo = this.userInfoService.getUserInfoCache();

    this.route.snapshot.data['shareTitle'] = `活力长三角，青商新机遇`;
    this.route.snapshot.data['shareDesc'] = `打造世界级产业集群，构建长三角竞争新环境。`;
    this.route.snapshot.data['shareCover'] = `https://og9s6vxbs.qnssl.com/cover/img/Fte2KrHT3TgRCXC70qgpJT8EINNq-1527036137.jpg~1-1?imageMogr2/auto-orient/thumbnail/!120x120r/gravity/Center/crop/120x120/strip`;
    this.route.snapshot.data['shareLink'] = `${host.self}/lives/changsanjiao2018`;

    this.isLoading = true;
    this.getLists( this.liveIdList ).finally(() => {
      this.isLoading = false;
    });
  }

  ngAfterViewChecked () {
    document.title = '活力长三角，青商新机遇';
  }

  ngOnDestroy () {
    clearInterval(this.timer);
  }

  gotoLiveRoomInfo(liveId: string) {
    this.router.navigate([`/lives/${liveId}/info`]);
  }

  gotoLiveRoom(liveId: string) {
    this.router.navigate([`/lives/${liveId}`]);
  }

  getLists(liveIdList: Array<string>): Promise<LiveInfoModel[]> {
    let livesList: LiveInfoModel [] = [];
    let promiseList = [];

    liveIdList.forEach((liveId) => {
      const url = `${environment.config.host.io}/api/live/objects/${ liveId }/info`;
      let promise = this.http.get(url).toPromise();
      promiseList.push(promise);
    }
  );
     return Promise.all(promiseList).then((results) => {
      results.forEach( (item) => {
        let data = item.json();
        let liveInfo = data.object;

        if (liveInfo) {
          let usersData = data.users;
          let liveInfoParsed = this.liveService.parseLiveInfo(liveInfo, usersData);
          livesList.push(liveInfoParsed);
        }
      });

       this.livesList = livesList.map( (i: LiveInfoModel) => {
         this.liveTime[i.id] = UtilsService.praseLiveTime(i);
         return i;
       });

       this.liveService.getLiveInfo(livesList[0].id, true).then( (liveData) => {
         this.topLiveInfo = liveData;
       });

       this.getSubscribeLink();

      return livesList;
    });
  }

  // 订阅直播通知函数
  bookLive () {
    if (this.userInfo) {
      if (this.booking || !this.livesList) {
        return;
      }

      this.booking = true;

      Promise.all<UserInfoModel, LiveInfoModel>([
        this.userInfoService.getUserInfo(false),
        this.liveService.bookLives(this.livesList),
      ]).then(result => {
        this.userInfo = result[0];
        this.topLiveInfo = result[1];

        if (!this.userInfo.isSubscribed && !this.isInApp) {
          this.showQrcode();
        } else if (!this.userInfo.isSubscribed && this.isInApp) {
          this.showQrcode();
        } else if (this.userInfo.isSubscribed) {
          this.operationTipsService.popup('订阅成功');
        }
      }).finally(() => {
        this.booking = false;
      });

    } else {
      this.toLogin();
    }
  }

  showQrcode() {
    if (!this.userInfo) {
      return;
    }

    this.isQrcodeShown = true;
    clearInterval(this.timer);

    // 轮询用户是否已订阅公众号
    this.timer = setInterval(() => {
      this.userInfoService.getUserInfo().then((userInfo) => {
        if (userInfo.isSubscribed) {
          this.closeQrcode();
          this.operationTipsService.popup('订阅成功');
          clearInterval(this.timer);
        }
        this.userInfo = userInfo;
      });
    }, 3 * 1000);
  }

  closeQrcode() {
    this.isQrcodeShown = false;
  }

  getSubscribeLink(): Promise<void> {
    if (this.isSubscribeLinkLoading)  return;
    if (!this.livesList) return;

    this.isSubscribeLinkLoading = true;
    this.isSubscribeLinkError = false;

    return this.liveService.getSubscribeLink(this.livesList[0].id).then(link => {
      this.qrcode = link;
      return;
    }).catch((err) => {
      this.isSubscribeLinkError = true;
      throw err;
    }).finally(() => {
      this.isSubscribeLinkLoading = false;
    });
  }

  toLogin () {
    this.router.navigate(['/signin'], {queryParams: {redirectTo: '/lives/wiee'}});
  }
}
