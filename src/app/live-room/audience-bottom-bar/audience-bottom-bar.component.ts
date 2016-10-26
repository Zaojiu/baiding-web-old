import {Component, Input, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {TimelineService} from '../timeline/timeline.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {LiveService} from '../../shared/api/live/live.service';
import {MessageService} from '../timeline/message/message.service';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {CommentApiService} from "../../shared/api/comment/comment.service";
import {UserAnimEmoji} from '../../shared/praised-animation/praised-animation.model';
import {MqEvent, EventType} from '../../shared/mq/mq.service';
import {EditMode} from "./audience-bottom-bar.enums";

declare var $: any;

@Component({
  selector: 'audience-bottom-bar',
  templateUrl: './audience-bottom-bar.component.html',
  styleUrls: ['./audience-bottom-bar.component.scss'],
  providers: [CommentApiService]
})

export class AudienceBottomBarComponent implements OnInit {
  id: string;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  commentContent: string;
  isOnCommentRequest: boolean;
  praisedSub: Subscription;
  isLoading: boolean;
  private receviedAvatarTouchedSub: Subscription;
  private el: HTMLElement;
  @ViewChild('commentInput') commentInput: ElementRef;
  modeEnums = EditMode;
  mode = EditMode.None;

  constructor(private route: ActivatedRoute, private liveService: LiveService, private commentApiService: CommentApiService,
              private timelineService: TimelineService, private  messageService: MessageService, el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    console.log(this.liveInfo.editors,'editors');
    this.id = this.route.snapshot.params['id'];

    this.praisedSub = this.timelineService.event$.subscribe((evt: MqEvent) => {
      if (evt.event != EventType.LivePraise) {
        return
      }
      if (evt.info.user.uid == this.userInfo.uid) {
        return
      }
      let userAnim = new UserAnimEmoji;
      userAnim.emoji = evt.info.emoji;
      userAnim.user = new UserInfoModel;
      this.liveInfo.praisedAnimations.push(userAnim);
    });

    //监听点击用户头像事件
    this.receviedAvatarTouchedSub = this.messageService.avatarTouched$.subscribe((userTouched)=> {
      this.commentContent = `@${userTouched.nick}(${userTouched.uid}) `;
      this.mode = EditMode.Text;
      this.switchMode(this.mode);
    });
  }

  ngOnDestroy() {
    this.praisedSub.unsubscribe();
    if (this.receviedAvatarTouchedSub) {
      this.receviedAvatarTouchedSub.unsubscribe()
    }
  }

  postComment() {
    if (this.commentContent === '') return;
    if (this.isOnCommentRequest) return;

    this.isOnCommentRequest = true;

    this.commentApiService.postComment(this.id, this.commentContent).then(() => {
      this.isOnCommentRequest = false;
    });
  }

  switchMode(mode: EditMode) {
    if (mode !== EditMode.Text) this.blurMessageInput();

    this.mode = mode;

    if (mode === EditMode.None)this.commentContent = '';

    if (this.mode === EditMode.Text) this.focusMessageInput();
  }

  focusMessageInput() {
    this.commentInput.nativeElement.focus();
  }

  blurMessageInput() {
    this.commentInput.nativeElement.blur();
  }

  confirmPraise(emoji: string) {
    let userAnim = new UserAnimEmoji;
    userAnim.user = this.userInfo;
    userAnim.emoji = emoji;
    this.liveInfo.praisedAnimations.push(userAnim);

    if (this.isLoading) return;

    this.isLoading = true;
    this.liveService.praiseLive(this.liveInfo.id, this.liveInfo.hadPraised, emoji).then(() => this.isLoading = false);

    this.liveInfo.hadPraised = true;
    this.liveInfo.praised += 1;
  }
}
