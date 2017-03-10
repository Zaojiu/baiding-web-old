import {Component, ViewChildren, QueryList, ViewChild, OnInit, OnDestroy}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {MessageModel} from '../../shared/api/message/message.model';
import {MessageApiService} from "../../shared/api/message/message.api";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {ShareBridge} from "../../shared/bridge/share.interface";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
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
import {Subscription} from "rxjs";
import {HistoryService} from "./history.service";
import {UserInfoCardService} from "../../shared/user-info-card/user-info-card.service";

@Component({
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})

export class HistoryComponent implements OnInit, OnDestroy {
  liveId: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  messages: MessageModel[] = [];
  audioMessages: MessageModel[] = [];
  comments: CommentModel[] = [];
  coverUrl: string;
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
  refreshSub: Subscription;
  contentParsed: {[key: string]: string} = {};

  constructor(private liveService: LiveService, private route: ActivatedRoute,
              private router: Router, private shareBridge: ShareBridge,
              private sanitizer: DomSanitizer, private commentApiService: CommentApiService,
              private operationService: OperationTipsService, private authBridge: AuthBridge,
              private liveRoomService: LiveRoomService, private audioPlayerService: AudioPlayerService,
              private historyService: HistoryService, private messageApiService: MessageApiService,
              private userInfoCardService: UserInfoCardService) {
  }

  ngOnInit() {
    this.liveId = this.route.snapshot.params['id'];
    this.userInfo = this.route.snapshot.data['userInfo'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.messages = this.route.snapshot.data['messages'];
    this.isAutoPlayNext = this.liveRoomService.isAudioAutoPlay(this.liveId);
    this.audioMessages = this.messages.filter((message) => message.isAudio());
    this.coverUrl = this.liveInfo.coverSmallUrl;
    this.listNextComments();

    this.messages.map((msg) => {
      if (msg.isText() || msg.isNice()) this.contentParsed[msg.id] = UtilsService.parseAt(msg.content);
    });

    this.route.snapshot.data['title'] = this.liveInfo.subject;
    this.route.snapshot.data['shareTitle'] = this.liveInfo.subject;
    this.route.snapshot.data['shareDesc'] = this.getLatestText();
    this.route.snapshot.data['shareCover'] = this.liveInfo.coverThumbnailUrl;
    this.route.snapshot.data['shareLink'] = this.getShareUri();

    this.refreshSub = this.historyService.messageRefresh$.subscribe(() => {
      this.messageApiService.history(this.liveId, true).then(messages => {
        this.messages = messages;
      })
    });
  }

  ngOnDestroy() {
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  getLatestText(): string {
    for (let message of this.messages) {
      if (message.isText() || message.isNice()) return message.content;
      if (message.isAudio() && message.audio.translateResult) return message.audio.translateResult;
    }

    return '';
  }

  getShareUri(): string {
    let uriTree = this.router.createUrlTree([`/lives/${this.liveId}/history`]);
    let path = this.router.serializeUrl(uriTree);
    return `${location.protocol}//${location.hostname}${path}`;
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
      components[currentIndex + 1].play();
    }

    if (currentIndex !== -1 && currentIndex + 2 < components.length) {
      this.audioPlayerService.preloadAudio(components[currentIndex + 2].message);
    }
  }

  editMessage(message: MessageModel) {
    this.router.navigate([`/lives/${this.liveId}/history/${message.id}/edit`]);
  }

  playList() {
    if (this.isPlayerShown) {
      this.audioListPlayer.stopVoice();
    } else {
      this.audioListPlayer.playVoice(true);
    }

    this.isPlayerShown = !this.isPlayerShown;
  }

  showUserInfoCard(uid: number) {
    this.userInfoCardService.popup(uid);
  }
}
