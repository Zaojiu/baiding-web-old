import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LiveService} from "../../shared/api/live/live.service";
import {LiveInfoModel, LiveRoomPresentModel} from "../../shared/api/live/live.model";
import {UserInfoModel, UserPublicInfoModel} from "../../shared/api/user-info/user-info.model";
import {AudienceInvitationModel} from "../../shared/api/invite/invite.model";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {InviteApiService} from "../../shared/api/invite/invite.api";
import {SharePopupService} from "../../shared/share-popup/share-popup.service";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SenderApiService, SmsScene} from "../../shared/api/sender/sender.api";
import {RegexpConst} from "../../shared/utils/regexp";
import {UtilsService} from "../../shared/utils/utils";
import {ShareBridge} from "../../shared/bridge/share.interface";

@Component({
  templateUrl: './present.component.html',
  styleUrls: ['./present.component.scss'],
})

export class PresentComponent implements OnInit {
  liveId: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  fromUid: number;
  fromUser: UserPublicInfoModel;
  editors: AudienceInvitationModel[];
  presentInfo: LiveRoomPresentModel;
  isLoading = false;
  isSubmitting = false;
  form: FormGroup;
  phoneNumber: string;
  smsCode: string;
  smsBtnText = '发送验证码';
  smsBtnAvailable = true;

  constructor(private router: Router, private route: ActivatedRoute,
              private liveApi: LiveService, private userInfoService: UserInfoService,
              private inviteApi: InviteApiService, private sharePopupService: SharePopupService,
              private tipsService: OperationTipsService, private fb: FormBuilder,
              private senderApiService: SenderApiService, private shareBridge: ShareBridge) {}

  ngOnInit() {
    this.liveId = this.route.snapshot.params['id'];
    this.userInfo = this.userInfoService.getUserInfoCache();
    this.fromUid = +this.route.snapshot.queryParams['fromUid'];
    if (!this.fromUid) {
      this.fromUid = this.userInfo.uid;
      this.router.navigate([`/lives/${this.liveId}/present`], {queryParams: {fromUid: this.userInfo.uid}});
    }

    if (!this.isMobileBinded) {
      this.form = this.fb.group({
        'phoneNumber': new FormControl(this.phoneNumber, [
          Validators.required,
          Validators.pattern(RegexpConst.mobile),
        ]),
        'smsCode': new FormControl(this.smsCode, [
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/),
        ]),
      });
    }

    this.initData();
  }

  initData() {
    this.isLoading = true;

    Promise.all<LiveInfoModel, UserPublicInfoModel, AudienceInvitationModel[], LiveRoomPresentModel>([
      this.liveApi.getLiveInfo(this.liveId),
      this.userInfoService.getUserPublicInfo(this.fromUid),
      this.inviteApi.audienceListInvitations(this.liveId),
      this.liveApi.presents(this.liveId, this.fromUid),
    ]).then((result) => {
      this.liveInfo = result[0];
      this.fromUser = result[1];
      this.editors = result[2];
      this.presentInfo = result[3];
      this.setShareInfo();
    }).finally(() => {
      this.isLoading = false;
    });
  }

  setShareInfo() {
    this.shareBridge.setShareInfo(
      `${this.fromUser.nick}花钱请你看直播，前${this.presentInfo.totalPresent}免费，手慢无 #${this.liveInfo.subject}`,
      `${this.liveInfo.subject}。${this.editors.length}位大咖，诚意分享，干货十足！`,
      this.liveInfo.coverThumbnailUrl,
      location.href
    );
  }

  get btnText(): string {
    if (!this.liveInfo || !this.userInfo || !this.presentInfo || !this.fromUser) return '';

    if (this.isSelf) {
      if (!this.liveInfo.isNeedPay) {
        return '免费话题间，分享给好友';
      } else {
        if (!this.liveInfo.paid) {
          return '未购买话题间，购买后分享';
        } else {
          if (this.liveInfo.isPayByPresent()) {
            return '不可赠送，返回话题间';
          } else {
            return '分享给好友';
          }
        }
      }
    } else {
      if (!this.liveInfo.isNeedPay) {
        return '免费话题间，前往观看';
      } else {
        if (this.liveInfo.paid) {
          if (this.liveInfo.isPayByPresent()) {
            return '已抢过，前往观看';
          } else {
            return '已购买，前往观看';
          }
        } else {
          if (!this.presentInfo.leftPresent) {
            return '抢光啦！去购买';
          } else {
            return '抢鲜看';
          }
        }
      }
    }
  }

  get buttonClass(): string {
    if (!this.liveInfo || !this.userInfo || !this.presentInfo || !this.fromUser) return '';

    if (this.isSelf) {
      return 'button button-primary';
    } else {
      if (this.liveInfo.isNeedPay && !this.liveInfo.paid && this.presentInfo.leftPresent) {
        return 'big-button';
      } else {
        return 'button button-primary';
      }
    }
  }

  btnClick() {
    if (!this.liveInfo || !this.userInfo || !this.presentInfo || !this.fromUser) return;

    if (this.isSelf) {
      if (!this.liveInfo.isNeedPay) {
        this.sharePopupService.popup(location.href);
        return;
      } else {
        if (!this.liveInfo.paid) {
          this.router.navigate([`/lives/${this.liveId}/info`]);
          return;
        } else {
          if (this.liveInfo.isPayByPresent()) {
            this.router.navigate([`/lives/${this.liveId}/info`]);
            return;
          } else {
            this.sharePopupService.popup(location.href);
            return;
          }
        }
      }
    } else {
      if (this.liveInfo.isNeedPay && !this.liveInfo.paid && this.presentInfo.leftPresent) {
        this.receivePresents();
        return;
      } else {
        this.router.navigate([`/lives/${this.liveId}/info`]);
        return;
      }
    }
  }

  receivePresents() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    this.liveApi.receivePresents(this.liveId, this.fromUid).then(() => {
      return this.liveApi.getLiveInfo(this.liveId, true);
    }).then(() => {
      this.tipsService.popup('抢到了，前往观看');
      this.router.navigate([`/lives/${this.liveId}/info`]);
    }).catch(err => {
      const data = err.json();
      if (data && data.code) {
        if (data.code === 2000) {
          this.tipsService.popup('已抢过');
        } else {
          this.tipsService.popup(`未知错误：${data.code}`);
        }
      } else {
        this.tipsService.popup('网络错误，请重试');
      }
    }).finally(() => {
      this.isSubmitting = false;
    });
  }

  validateAndSubmit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });

    if (this.form.invalid) return;

    this.submit();
  }

  submit() {
    this.isSubmitting = true;
    this.tipsService.popup('登录中...');

    this.userInfoService.signup(this.phoneNumber, this.smsCode, UtilsService.randomId(32), '', '', '').then(() => {
      return this.userInfoService.getUserInfo();
    }).then((userInfo) => {
      this.userInfo = userInfo;
      this.tipsService.popup('登录成功');
    }).catch((err) => {
      throw err;
    }).finally(() => {
      this.isSubmitting = false;
    });
  }

  get isMobileValid(): boolean {
    this.form.controls['phoneNumber'].markAsDirty();
    this.form.controls['phoneNumber'].updateValueAndValidity();
    return this.form.controls['phoneNumber'].valid;
  }

  sendSMS() {
    const isMobileValid = this.isMobileValid;

    if (!isMobileValid) this.tipsService.popup('请填写正确的手机号码再发送验证码');

    if (!this.smsBtnAvailable || !isMobileValid) return;

    this.smsBtnAvailable = false;

    this.senderApiService.sendSmsByLoginUser(this.phoneNumber, SmsScene.BindMobile).then(() => {
      let timer = null;
      let countDown = 60;

      this.smsBtnText = `${countDown}s`;
      this.tipsService.popup('验证码发送成功');
      timer = setInterval(() => {
        countDown--;
        if (countDown === 0) {
          this.smsBtnAvailable = true;
          this.smsBtnText = `发送验证码`;
          clearInterval(timer);
        } else {
          this.smsBtnText = `${countDown}s`;
        }
      }, 1000);
    }).catch((e) => {
      this.smsBtnAvailable = true;
    });
  }

  get isSelf(): boolean {
    return this.fromUid === this.userInfo.uid;
  }

  get isMobileBinded(): boolean {
    return !!this.userInfo.mobile.number;
  }
}
