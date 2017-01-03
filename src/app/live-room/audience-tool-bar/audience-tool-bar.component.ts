import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Router} from "@angular/router";

import {LiveInfoModel} from '../../shared/api/live/live.model';
import {LiveService} from '../../shared/api/live/live.service';
import {MessageService} from '../timeline/message/message.service';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {UserAnimEmoji} from '../../shared/praised-animation/praised-animation.model';
import {EditMode} from "../../shared/comment-input/comment-input.enums";

@Component({
  selector: 'audience-tool-bar',
  templateUrl: './audience-tool-bar.component.html',
  styleUrls: ['./audience-tool-bar.component.scss'],
})

export class AudienceToolBarComponent implements OnInit, OnDestroy {
  @Input() liveId: string;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  commentContent = '';
  modeEnums = EditMode;
  mode = EditMode.None;
  isPraisePosting: boolean;
  private receviedAvatarTouchedSub: Subscription;

  constructor(private liveService: LiveService,
              private  messageService: MessageService, private router: Router) {
  }

  ngOnInit() {
    //监听点击用户头像事件
    this.receviedAvatarTouchedSub = this.messageService.avatarTouched$.subscribe((userTouched)=> {
      this.commentContent = `@${userTouched.nick}(${userTouched.uid}) `;
      this.mode = EditMode.Text;
    });
  }

  ngOnDestroy() {
    if (this.receviedAvatarTouchedSub) this.receviedAvatarTouchedSub.unsubscribe();
  }

  confirmPraise(emoji: string) {
    let userAnim = new UserAnimEmoji;
    userAnim.user = this.userInfo;
    userAnim.emoji = emoji;
    this.liveInfo.praisedAnimations.push(userAnim);

    if (this.isPraisePosting) return;

    this.isPraisePosting = true;
    this.liveInfo.hadPraised = true;
    this.liveInfo.praised += 1;

    this.liveService.praiseLive(this.liveInfo.id, this.liveInfo.hadPraised, emoji).finally(() => {
      this.isPraisePosting = false;
    });
  }

  goSettings() {
    this.router.navigate([`/lives/${this.liveId}/settings`]);
  }
}
