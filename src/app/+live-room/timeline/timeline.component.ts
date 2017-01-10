import {
  Component, OnInit, OnDestroy, Input, ViewChild, ViewChildren, QueryList
} from '@angular/core';
import {Subscription}   from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';

import {MessageModel, InputtingMessageModel} from '../../shared/api/message/message.model';
import {MessageType} from '../../shared/api/message/message.enum';
import {TimelineService} from './timeline.service';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {MqPraisedUser, MqEvent, EventType} from '../../shared/mq/mq.service';
import {MessageApiService} from "../../shared/api/message/message.api";
import {ScrollerDirective} from "../../shared/scroller/scroller.directive";
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";
import {ScrollerPosition} from "../../shared/scroller/scroller.enums";
import {UserAnimEmoji} from '../../shared/praised-animation/praised-animation.model';
import {AudioPlayerService} from '../../shared/audio-player/audio-player.service';
import {InputtingService} from './message/inputting.service';

import {InputtingComponent} from './message/inputting.component';
import {HackMessages} from "./hack-messages";
import {LiveRoomService} from "../live-room.service";

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})


export class TimelineComponent implements OnInit, OnDestroy {
  id: string;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  @ViewChild(ScrollerDirective) scroller: ScrollerDirective;
  messages: MessageModel[] = [];
  receviedReplySubscription: Subscription;
  isOnOldest: boolean;
  isOnLatest: boolean;
  isOnBottom: boolean;
  isLoading: boolean;
  unreadCount = 0;
  historyTipsShown = false;
  private audioSub: Subscription;

  @ViewChild('inputtingComp') inputtingComp: InputtingComponent;


  constructor(private route: ActivatedRoute, private router: Router, private timelineService: TimelineService,
              private liveService: LiveService, private messageApiService: MessageApiService, private liveRoomService: LiveRoomService,
              private audioPlayerService: AudioPlayerService, private inputtingService: InputtingService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.timelineService.startReceive(this.id);
    this.timelineService.onReceivedEvents(evt => this.onReceivedEvents(evt));
    this.timelineService.onReceivedPraises(prised => this.onReceivedPraises(prised));
    this.timelineService.onReceiveMessages(message => this.onReceiveMessages(message));
    this.timelineService.onDeleteMessages(message => this.onDeleteMessages(message));
    this.timelineService.onTimeLiveAction(goto => this.onTimelineAction(goto));

    this.audioSub = this.audioPlayerService.globalAudio$.filter(event => event.isEnded()).subscribe(event => {
      this.onAudioPlayEnded(event.data.message);
    });

    this.startReceiveReply();
    this.gotoLatestMessages().then(result => {
      setTimeout(() => {
        this.scroller.scrollToBottom();
      }, 0);
    });

    this.checkHistoryTips();
  }

  ngOnDestroy() {
    this.timelineService.stopReceive(this.id);
    this.timelineService.unsubscribeAll();
    if (this.audioSub) this.audioSub.unsubscribe();
  }

  private findNextAudioTypeMessage(msgId: string): MessageModel {
    let i = 0;

    for (; i < this.messages.length; i++) {
      if (this.messages[i].id === msgId) {
        break;
      }
    }

    for (i++; i < this.messages.length; i++) {
      if (this.messages[i].isAudio()) {
        return this.messages[i];
      }
    }

    return null;
  }

  onAudioPlayEnded(msg: MessageModel) {
    if (!this.liveRoomService.isAudioAutoPlay(this.liveInfo.id)) return;

    let nextAudioMessage = this.findNextAudioTypeMessage(msg.id);
    if (!nextAudioMessage) return;

    this.audioPlayerService.play(nextAudioMessage).subscribe();
  }

  autoPlayReceived(receivedMessages: MessageModel[]) {
    if (!this.liveRoomService.isAudioAutoPlay(this.liveInfo.id)) return;
    if (this.audioPlayerService.hasPlaying) return;
    if (!this.audioPlayerService.userActivated) return;

    for (let message of receivedMessages) {
      if (message.isAudio()) {
        this.audioPlayerService.play(message);
        break;
      }
    }
  }

  onReceivedEvents(evt: MqEvent) {
    switch (evt.event) {
      case EventType.LiveMsgUpdate:
        if (this.isOnBottom) {
          this.inputtingComp.hide();

          this.gotoLatestMessages().then(messages => {
            setTimeout(() => {
              this.scroller.scrollToBottom();
              this.autoPlayReceived(messages);
            }, 0);
          });
        } else {
          this.unreadCount++;
          this.isOnLatest = false;
        }
        break;
      case EventType.LiveClosed:
        this.liveService.getLiveInfo(this.id, true).then((result) => {
          this.liveInfo = result;
          this.checkHistoryTips();
        });
        break;
      case EventType.LiveMessageInputting:
        let i = new InputtingMessageModel();
        i.type = evt.info.type;
        i.user = new UserInfoModel();
        i.user.avatar = evt.info.user.avatar;
        i.user.nick = evt.info.user.nick;
        i.user.uid = evt.info.user.uid;
        this.inputtingService.push(i);
        break;
    }
  }

  onReceivedPraises(praisedUser: MqPraisedUser) {
    if (praisedUser.user.uid == this.userInfo.uid) return;

    for (let message of this.messages) {
      if (message.id == praisedUser.msgId) {
        let userAnim = new UserAnimEmoji;
        userAnim.user = praisedUser.user;
        message.pushPraisedUser(userAnim, praisedUser.praised, praisedUser.num)
      }
    }
  }

  onReceiveMessages(message: MessageModel) {
    for (let idx in this.messages) {
      if (this.messages[idx].id == message.id) {
        return
      }
    }
    this.scroller.appendData([message]);

    setTimeout(() => {
      this.scroller.scrollToBottom();
    }, 0);
  }

  onDeleteMessages(message: MessageModel) {
    for (let idx in this.messages) {
      if (this.messages[idx].id == message.id) {
        this.scroller.deleteData(+idx, 1);
      }
    }
  }

  gotoLatestMessages(): Promise<MessageModel[]> {
    if (this.isLoading) return Promise.reject('');

    this.isLoading = true;

    return this.messageApiService.listMessages(this.id, '', 11).then(messages => {
      messages.reverse();

      if (messages.length < 11) {
        HackMessages.hackLiveInfoMessage(this.liveInfo, messages);
      } else {
        messages.shift();
      }

      if (this.liveInfo.isClosed()) {
        HackMessages.hackLiveEndMessage(this.liveInfo, messages);
      }

      this.scroller.resetData(messages);
      this.isOnOldest = false;
      this.isOnLatest = true;
      this.isOnBottom = true;
      this.unreadCount = 0;
      return messages;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  gotoOldestMessages(): Promise<MessageModel[]> {
    if (this.isLoading) return Promise.reject('');

    this.isLoading = true;

    return this.messageApiService.listMessages(this.id, '', 11, ['createdAt']).then(messages => {
      HackMessages.hackLiveInfoMessage(this.liveInfo, messages);

      if (messages.length < 11 && this.liveInfo.isClosed()) {
        HackMessages.hackLiveEndMessage(this.liveInfo, messages);
      }

      if (messages.length >= 11) messages.pop();

      this.scroller.resetData(messages);

      this.isOnOldest = true;
      this.isOnLatest = false;
      this.isOnBottom = false;
      return messages;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  getNextMessages(marker: string, limit: number, sorts: string[]): Promise<void> {
    if (this.isLoading) return Promise.resolve();

    this.isLoading = true;

    return this.messageApiService.listMessages(this.id, marker, limit + 1, sorts).then(messages => {
      this.removeRepeat(messages);

      if (messages.length < limit + 1 && this.messages[this.messages.length - 1].type !== MessageType.LiveEnd) {
        HackMessages.hackLiveEndMessage(this.liveInfo, messages);
      } else {
        messages.shift();
      }

      this.scroller.appendData(messages);

      if (messages.length === 0) {
        this.isOnLatest = true;
        this.unreadCount = 0;
      }

      return;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  getPrevMessages(marker: string, limit: number, sorts: string[]): Promise<void> {
    if (this.isLoading) return Promise.resolve();

    this.isLoading = true;

    return this.messageApiService.listMessages(this.id, marker, limit + 1, sorts).then(messages => {
      this.removeRepeat(messages);

      messages.reverse();

      if (messages.length < limit + 1 && this.messages[0].type !== MessageType.LiveRoomInfo) {
        HackMessages.hackLiveInfoMessage(this.liveInfo, messages);
      } else {
        messages.pop();
      }

      this.scroller.prependData(messages);

      if (messages.length === 0) this.isOnOldest = true;

      return;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  onShowInputting() {
    this.isOnBottom && setTimeout(() => {
      this.scroller.scrollToBottom();
    }, 0);
  }

  onScroll(e: ScrollerEventModel) {
    if (this.messages.length !== 0) {
      if (e.position == ScrollerPosition.OnTop) {
        let firstMessage = this.findFirstAvailableMessage(this.messages);

        if (!firstMessage || this.isOnOldest) {
          this.scroller.hideHeadLoading();
          return;
        }

        this.getPrevMessages(`$lt${firstMessage.createdAt}`, 10, ['-createdAt']).finally(() => {
          this.scroller.hideHeadLoading();
        });
      } else if (e.position == ScrollerPosition.OnBottom) {
        let lastMessage = this.findLastAvailableMessage(this.messages);

        if (!lastMessage) {
          this.scroller.hideFootLoading();
          return;
        }

        this.getNextMessages(`$gt${lastMessage.createdAt}`, 10, ['createdAt']).finally(() => {
          this.scroller.hideFootLoading();
        });
      }
    }

    this.isOnBottom = e.position === ScrollerPosition.OnBottom;

    this.timelineService.triggerScroll(e);
  }

  onTimelineAction(gotoOldestOrLatest: boolean) {
    this.scroller.stopEmitScrollEvent();

    if (gotoOldestOrLatest) {
      this.gotoOldestMessages().then(result => {
        if (result) {
          setTimeout(() => {
            this.scroller.scrollToTop();

            // 等待滚动完毕
            setTimeout(() => {
              this.scroller.startEmitScrollEvent();
            }, 0);
          }, 0);
        }
      });
    } else {
      this.gotoLatestMessages().then(result => {
        if (result) {
          setTimeout(() => {
            this.scroller.scrollToBottom();

            // 等待滚动完毕
            setTimeout(() => {
              this.scroller.startEmitScrollEvent();
            }, 0);
          }, 0);
        }
      });
    }
  }

  startReceiveReply() {
    this.receviedReplySubscription = this.timelineService.receivedReply$.subscribe(
      reply => {
        for (let message of this.messages) {
          if (message.id === reply.parentId) {
            let hasReply = false;

            for (let _reply of message.replies) {
              if (reply.id === _reply.id) {
                hasReply = true;
              }
            }

            if (!hasReply) message.replies.push(reply);
          }
        }
      }
    );
  }

  removeRepeat(messages: MessageModel[]) {
    if (!messages || !messages.length) return;

    let idsX = {};
    for (let idx in this.messages) {
      idsX[this.messages[idx].id] = idx
    }
    let idY = {};
    let idxs = [];
    for (let message of messages) {
      idY[message.id] = true;
      if (idsX[message.id] !== undefined) {
        idxs.push(idsX[message.id])
      }
    }
    idxs.sort().reverse();
    for (let idx of idxs) {
      this.scroller.deleteData(idx, 1);
    }
  }

  triggerGotoLatest() {
    this.timelineService.gotoLastMessage();
  }

  findFirstAvailableMessage(messages: MessageModel[]): MessageModel {
    for (let message of messages) {
      if (
        message.type === MessageType.Text ||
        message.type === MessageType.Image ||
        message.type === MessageType.Audio ||
        message.type === MessageType.Nice ||
        message.type === MessageType.EditorJoin ||
        message.type === MessageType.LiveStart
      ) {
        return message;
      }
    }
  }

  findLastAvailableMessage(messages: MessageModel[]): MessageModel {
    let _messages = _.clone(messages);
    _messages.reverse();
    return this.findFirstAvailableMessage(_messages);
  }

  gotoHistory() {
    this.router.navigate([`/lives/${this.id}/history`]);
  }

  checkHistoryTips() {
    this.historyTipsShown = this.liveRoomService.getHistoryTipsShown(this.id);
    if (!this.historyTipsShown && this.liveInfo.isClosed()) {
      this.liveRoomService.setHistoryTipsShown(this.id);
    }
  }
}
