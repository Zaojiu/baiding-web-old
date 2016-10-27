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
import {Router} from "@angular/router";

declare var $: any;

@Component({
  selector: 'audience-bottom-bar',
  templateUrl: './audience-bottom-bar.component.html',
  styleUrls: ['./audience-bottom-bar.component.scss'],
  providers: [CommentApiService]
})

export class AudienceBottomBarComponent implements OnInit {
  @Input() liveId: string;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  commentContent = '';
  isOnCommentRequest: boolean;
  isLoading: boolean;
  private receviedAvatarTouchedSub: Subscription;
  private el: HTMLElement;
  @ViewChild('commentInput') commentInput: ElementRef;
  modeEnums = EditMode;
  mode = EditMode.None;

  constructor(private route: ActivatedRoute, private liveService: LiveService, private commentApiService: CommentApiService,
              private timelineService: TimelineService, private  messageService: MessageService, el: ElementRef, private router: Router) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    //监听点击用户头像事件
    this.receviedAvatarTouchedSub = this.messageService.avatarTouched$.subscribe((userTouched)=> {
      this.commentContent = `@${userTouched.nick}(${userTouched.uid}) `;
      this.mode = EditMode.Text;
      this.switchMode(this.mode);
    });
  }

  ngOnDestroy() {
    if (this.receviedAvatarTouchedSub) {
      this.receviedAvatarTouchedSub.unsubscribe()
    }
  }

  parseAtUser(): UserInfoModel[] {
    var atRegexp = /(@.+?)\((.+?)\)/g;
    let atUids: number[] = [];
    let toUsers: UserInfoModel[] = [];

    while (true) {
      var atTextArr = atRegexp.exec(this.commentContent);
      if (!atTextArr || atTextArr.length != 3 || !atRegexp.lastIndex) {
        break
      }
      atUids.push(+atTextArr[2]);
    }

    for (let uid of atUids) {
      if (uid === this.liveInfo.admin.uid) {
        toUsers.push(this.liveInfo.admin);

      }
    }
    for (let user of this.liveInfo.editors) {
      for (let uid of atUids) {
        if (uid === user.uid) {
          toUsers.push(user);
        }
      }
    }
    return toUsers;
  }


  postComment() {
    if (this.commentContent === '') return;
    if (this.isOnCommentRequest) return;

    this.isOnCommentRequest = true;

    this.commentApiService.postComment(this.liveId, this.commentContent, this.parseAtUser()).then(() => {
      this.isOnCommentRequest = false;
      this.commentContent = '';
    });
  }

  switchMode(mode: EditMode) {
    if (mode !== EditMode.Text) this.blurMessageInput();

    this.mode = mode;

    if (mode === EditMode.None)this.commentContent = '';

    if (this.mode === EditMode.Text) {
      this.focusMessageInput();
      this.detectContentChange();
    }
  }

  detectContentChange() {
    $(this.commentInput.nativeElement).on('input', () => {
      if (this.commentContent === '') return;
      if ($.isNumeric(this.commentContent[this.commentContent.length - 1])) {
        this.commentContent = this.commentContent.replace(/(.*)@[\W\w]+?\(\d+?$/g, '$1');
      }
    })
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

  goSettings() {
    this.router.navigate([`/lives/${this.liveId}/settings`]);
  }

  changeCommentContent(editor: UserInfoModel) {
    if (this.commentContent.indexOf(editor.uid.toString()) !== -1) {
      this.commentContent = this.commentContent.replace(`@${editor.nick}(${editor.uid}) `, '');
    } else {
      this.commentContent += `@${editor.nick}(${editor.uid}) `;
    }
  }

  selected(uid: number): boolean {

    return this.commentContent.indexOf(uid.toString()) !== -1;
  }
}
