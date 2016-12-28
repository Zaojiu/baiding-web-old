import {Component, ViewChildren, QueryList, ViewChild}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {MessageModel} from '../../shared/api/message/message.model';
import {MessageApiService} from "../../shared/api/message/message.api";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {ShareBridge} from "../../shared/bridge/share.interface";
import {SafeUrl, DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {UtilsService} from "../../shared/utils/utils";
import {CommentApiService} from "../../shared/api/comment/comment.service";
import {CommentModel} from "../../shared/api/comment/comment.model";
import {EditMode} from "../../shared/comment-input/comment-input.enums";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {AuthBridge} from "../../shared/bridge/auth.interface";
import {LiveRoomService} from "../live-room.service";
import {AudioPlayerSmallComponent} from "../../shared/audio-player/audio-player-small.component";
import {AudioPlayerService} from "../../shared/audio-player/audio-player.service";
import {AudioListPlayerComponent} from "../../shared/audio-player/audio-list-player.component";

@Component({
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})

export class HistoryComponent {
  liveId: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  messages: MessageModel[] = [];
  audioMessages: MessageModel[] = [];
  comments: CommentModel[] = [];
  coverUrl: SafeUrl;
  isLoading = true;
  commentsPerQuery = 11;
  isCommentLoading = true;
  hasNextComment = false;
  parsedCommentContent = {};
  commentContent = '';
  modeEnums = EditMode;
  mode = EditMode.None;
  isAutoPlayNext = false;
  isPlayerShown = false;
  @ViewChildren('audioPlayerSmall') audioPlayerSmall: QueryList<AudioPlayerSmallComponent>;
  @ViewChild('audioListPlayer') audioListPlayer: AudioListPlayerComponent;

  constructor(private liveService: LiveService, private route: ActivatedRoute, private router: Router,
              private messageApiService: MessageApiService, private shareBridge: ShareBridge,
              private sanitizer: DomSanitizer, private commentApiService: CommentApiService,
              private operationService: OperationTipsService, private authBridge: AuthBridge,
              private liveRoomService: LiveRoomService, private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.liveId = this.route.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    let coverUrl = this.liveInfo.coverSmallUrl ? this.liveInfo.coverSmallUrl : '/assets/img/default-cover.jpg';
    this.coverUrl = this.sanitizer.bypassSecurityTrustUrl(coverUrl);

    this.isAutoPlayNext = this.liveRoomService.isAudioAutoPlay(this.liveId);

    this.messageApiService.history(this.liveId).then(messages => {
      this.messages = messages;
      this.audioMessages = messages.filter((message) => message.isAudio());
    }, () => {
      this.backToMainScreen();
    }).finally(() => {
      this.isLoading = false;
    });

    this.listNextComments();
  }

  listNextComments(lastComment?: CommentModel) {
    let marker = lastComment ? `$lt${lastComment.createdAt}` : '';

    this.isCommentLoading = true;

    this.commentApiService.listComments(this.liveId, [], marker, this.commentsPerQuery, ['-createdAt']).then((comments) => {
      if (comments.length < this.commentsPerQuery) {
        this.hasNextComment = false;
      } else {
        this.hasNextComment = true;
      }

      if (comments.length === this.commentsPerQuery) comments.pop();

      for (let comment of comments) {
        if (comment.content) this.parsedCommentContent[comment.id] = this.parseContent(comment.content);
      }

      this.comments.push(...comments);
    }).finally(() => {
      this.isCommentLoading = false;
    });
  }

  parseContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(UtilsService.parseAt(content));
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.liveId]);
  }

  setPraised() {
    if (this.liveInfo.hadPraised) return;

    this.liveService.praiseLive(this.liveId, this.liveInfo.hadPraised).then(liveInfo => {
      this.liveInfo = liveInfo;
    });
  }

  fireShare() {
    this.shareBridge.share();
  }

  avatarPressed(userInfo: UserInfoModel) {
    this.commentContent = `@${userInfo.nick}(${userInfo.uid}) `;
    this.mode = EditMode.Text;
  }

  postSuccessful(comment: CommentModel) {
    this.parsedCommentContent[comment.id] = this.parseContent(comment.content);
    this.comments.unshift(comment);
    this.operationService.popup('评论成功');
  }

  goSignin() {
    this.authBridge.auth(encodeURIComponent(location.href));
  }

  audioPlayEnded(msg: MessageModel) {
    if (!this.isAutoPlayNext) return;
    let components = this.audioPlayerSmall.toArray();
    let currentIndex = -1;

    for (let i in components) {
      if (components[i].message.id === msg.id) {
        currentIndex = +i;
        break;
      }
    }

    if (currentIndex !== -1 && currentIndex + 1 < components.length) {
      components[currentIndex+1].play();
    }

    if (currentIndex !== -1 && currentIndex + 2 < components.length) {
      this.audioPlayerService.preloadAudio(components[currentIndex+2].message);
    }
  }
}
