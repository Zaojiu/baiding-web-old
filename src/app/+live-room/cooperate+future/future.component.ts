import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../../shared/api/live/live.service";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {UtilsService} from "../../shared/utils/utils";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {appConfig, environment} from "../../../environments/environment";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {CustomHttp} from "../../shared/api/custom-http.service";


@Component({
  templateUrl: './future.component.html',
  styleUrls: ['./future.component.scss'],
})

export class FutureComponent implements OnInit, OnDestroy {
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
  liveIdList = ['5af54fa4202b320001c3fd57', '5afab456feb7a20001932f56', '5afab491e262e30001275490', '5afab4effeb7a20001932f59', '5afab527e262e30001275493'];

  constructor (private router: Router, private route: ActivatedRoute, private liveService: LiveService,
               private operationTipsService: OperationTipsService, private http: CustomHttp,
               private sanitizer: DomSanitizer, private userInfoService: UserInfoService) {
  }

  ngOnInit () {
    this.userInfo = this.userInfoService.getUserInfoCache();

    this.route.snapshot.data['shareTitle'] = `${this.userInfo ? this.userInfo.nick : '我'}正在使用${appConfig.name}，发现更多经验分享`;

    this.isLoading = true;
    this.getLists( this.liveIdList ).finally(() => {
      this.isLoading = false;
    });
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

  //订阅直播通知函数
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
