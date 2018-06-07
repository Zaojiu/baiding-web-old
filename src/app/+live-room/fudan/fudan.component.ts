import {Component, OnInit, OnDestroy, AfterViewChecked} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {DomSanitizer} from '@angular/platform-browser';
import {UtilsService} from '../../shared/utils/utils';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {environment, host} from '../../../environments/environment';
import {UserInfoService} from '../../shared/api/user-info/user-info.service';
import {OperationTipsService} from '../../shared/operation-tips/operation-tips.service';
import {CustomHttp} from '../../shared/api/custom-http.service';


@Component({
  templateUrl: './fudan.component.html',
  styleUrls: ['./fudan.component.scss'],
})

export class FuDanComponent implements OnInit, OnDestroy, AfterViewChecked {
  topLiveInfo: LiveInfoModel;
  livesList: LiveInfoModel[] = [];
  timeNow = UtilsService.now.toString();
  liveTime: { [liveId: string]: string } = {};
  timer: any;
  userInfo: UserInfoModel;
  qrcode: string;
  liveId: string;
  isInApp = UtilsService.isInApp;
  isInWechat = UtilsService.isInWechat;
  isLoading = false;
  isQrcodeShown = false;
  isSubscribeLinkLoading = false;
  isSubscribeLinkError = false;
  liveIdList = [
    '5b18f0a6f1292f0001016050'
  ];

  constructor(private router: Router, private route: ActivatedRoute, private liveService: LiveService,
              private operationTipsService: OperationTipsService, private http: CustomHttp,
              private sanitizer: DomSanitizer, private userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.topLiveInfo = this.route.snapshot.data['topLiveInfo'];
    this.userInfo = this.userInfoService.getUserInfoCache();

    this.route.snapshot.data['shareTitle'] = `复旦EMBA`;
    this.route.snapshot.data['shareDesc'] = `复旦EMBA-直播列表`;
    this.route.snapshot.data['shareCover'] = 'https://og9s6vxbs.qnssl.com/fudan/cover.jpg';
    this.route.snapshot.data['shareLink'] = `${host.self}/lives/fudan`;

    this.isLoading = true;
    this.getLists(this.liveIdList).finally(() => {
      this.isLoading = false;
    });
  }

  ngAfterViewChecked() {
    document.title = '复旦EMBA';
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  gotoLiveRoomInfo(liveId: string) {
    this.router.navigate([`/lives/${liveId}/info`]);
  }

  gotoLiveRoom(liveId: string) {
    // this.router.navigate([`/lives/${liveId}`]);
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
      results.forEach((item) => {
        let data = item.json();
        let liveInfo = data.object;

        if (liveInfo) {
          let usersData = data.users;
          let liveInfoParsed = this.liveService.parseLiveInfo(liveInfo, usersData);
          livesList.push(liveInfoParsed);
        }
      });

      this.livesList = livesList.map((i: LiveInfoModel) => {
        this.liveTime[i.id] = UtilsService.praseLiveTime(i);
        return i;
      });

      this.liveService.getLiveInfo(livesList[0].id, true).then((liveData) => {
        this.topLiveInfo = liveData;
      });

      this.getSubscribeLink();

      return livesList;
    });
  }

  getSubscribeLink(): Promise<void> {
    if (this.isSubscribeLinkLoading) {
      return;
    }
    if (!this.livesList) {
      return;
    }

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

  toLogin() {
    this.router.navigate(['/signin'], {queryParams: {redirectTo: '/lives/fudan'}});
  }
}
