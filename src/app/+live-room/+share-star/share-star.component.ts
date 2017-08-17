import {Component, OnInit}      from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LiveService} from "../../shared/api/live/live.service";
import {LiveInfoModel, ShareRankingModel} from "../../shared/api/live/live.model";
import {appConfig} from "../../../environments/environment";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";

@Component({
  templateUrl: './share-star.component.html',
  styleUrls: ['./share-star.component.scss'],
})

export class ShareStarComponent implements OnInit {
  liveId: string;
  shareRanking: ShareRankingModel[] = [];
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  shareCardSrc: SafeUrl;
  slogan = appConfig.slogan;
  myRanking = -1;
  isLoading = true;
  isError = false;
  isShareCardShow = false;
  isShareCardLoading = true;
  isShareCardError = false;

  constructor(private route: ActivatedRoute, private liveService: LiveService,
              private userInfoService: UserInfoService, private s: DomSanitizer) {}

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];

    this.userInfo = this.userInfoService.getUserInfoCache();

    this.getPageData();
  }

  getPageData() {
    this.isLoading = true;
    this.isError = false;

    Promise.all<ShareRankingModel[], LiveInfoModel, string>([
      this.liveService.getShareRanking(this.liveId),
      this.liveService.getLiveInfo(this.liveId, true),
      this.liveService.getMyShareCard(this.liveId),
    ]).then(result => {
      this.shareRanking = result[0];
      this.liveInfo = result[1];
      this.shareCardSrc = this.s.bypassSecurityTrustUrl(result[2]);

      this.shareRanking.forEach((v, i) => {
        if (v.uid === this.userInfo.uid) this.myRanking = i;
      });
    }, (err) => {
      this.isError = true;
      throw err;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  gotoShareCard() {
    this.isShareCardShow = true;
  }

  reloadShareCard() {
    this.isShareCardError = false;
    this.isShareCardLoading = true;

    const srcCache = this.shareCardSrc;
    this.shareCardSrc = '';
    setTimeout(() => this.shareCardSrc = srcCache);
  }
}
