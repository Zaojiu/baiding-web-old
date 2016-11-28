import {Component, Input, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {LiveInfoModel} from '../../shared/api/live/live.model';
import {LiveService} from '../../shared/api/live/live.service';
import {MessageService} from '../timeline/message/message.service';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {CommentApiService} from "../../shared/api/comment/comment.service";
import {UserAnimEmoji} from '../../shared/praised-animation/praised-animation.model';
import {EditMode} from "./audience-tool-bar.enums";
import {Router} from "@angular/router";
import {UtilsService} from "../../shared/utils/utils";

declare var $: any;

@Component({
  selector: 'audience-tool-bar',
  templateUrl: './audience-tool-bar.component.html',
  styleUrls: ['./audience-tool-bar.component.scss'],
})

export class AudienceToolBarComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() liveId: string;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  commentContent = '';
  isOnCommentRequest: boolean;
  isLoading: boolean;
  private receviedAvatarTouchedSub: Subscription;
  @ViewChild('commentInput') commentInput: ElementRef;
  modeEnums = EditMode;
  mode = EditMode.None;

  constructor(private liveService: LiveService, private commentApiService: CommentApiService,
              private  messageService: MessageService, private router: Router) {
  }

  ngOnInit() {
    this.commentContent = this.liveService.getTextWordsStashed(this.liveId);

    //监听点击用户头像事件
    this.receviedAvatarTouchedSub = this.messageService.avatarTouched$.subscribe((userTouched)=> {
      this.commentContent = `@${userTouched.nick}(${userTouched.uid}) `;
      this.mode = EditMode.Text;
      this.switchMode(this.mode);
    });
  }

  ngOnDestroy() {
    if (this.receviedAvatarTouchedSub) {
      this.receviedAvatarTouchedSub.unsubscribe();
    }

    $(this.commentInput.nativeElement).off('focus');
  }

  ngAfterViewInit() {
    $(this.commentInput.nativeElement).on('focus', () => {
      UtilsService.resetWindowScroll();
    });
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
    if (mode !== EditMode.Text) {
      this.liveService.setTextWordsStashed(this.commentContent, this.liveId);
      this.blurMessageInput();
    }

    this.mode = mode;

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
      if (this.commentContent[this.commentContent.length - 1] === '@') {
        this.switchMode(EditMode.At);
      }
    });
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
      if (this.commentContent === '') {
        this.commentContent += `@${editor.nick}(${editor.uid}) `;
      } else if (this.commentContent[this.commentContent.length - 1] === '@') {
        this.commentContent += `${editor.nick}(${editor.uid}) `;
      } else {
        this.commentContent += `@${editor.nick}(${editor.uid}) `;
      }
    }
  }

  selected(uid: number): boolean {
    return this.commentContent.indexOf(uid.toString()) !== -1;
  }
}
