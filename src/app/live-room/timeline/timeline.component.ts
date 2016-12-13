import {
  Component, OnInit, OnDestroy, Input, ViewChild, ViewChildren, QueryList
} from '@angular/core';
import {Subscription}   from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';

import {MessageModel} from '../../shared/api/message/message.model';
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
import {AudioPlayerService} from '../../shared/audio-player/audio-player.service'

import {MessageComponent} from './message/message.component';
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
  timelineSubscription: Subscription;
  isOnOldest: boolean;
  isOnLatest: boolean;
  isOnBottom: boolean;
  isLoading: boolean;
  unreadCount = 0;

  @ViewChildren('messagesComponents') messagesComponents: QueryList<MessageComponent>;

  constructor(private route: ActivatedRoute, private router: Router, private timelineService: TimelineService,
              private liveService: LiveService, private messageApiService: MessageApiService,
              private  audioPlayerService: AudioPlayerService, private liveRoomService: LiveRoomService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.timelineService.startReceive(this.id);
    this.timelineService.onReceivedEvents(evt => this.onReceivedEvents(evt));
    this.timelineService.onReceivedPraises(prised => this.onReceivedPraises(prised));
    this.timelineService.onReceiveMessages(message => this.onReceiveMessages(message));
    this.timelineService.onDeleteMessages(message => this.onDeleteMessages(message));

    this.startObserveTimelineAction();
    this.startReceiveReply();
    this.gotoLatestMessages().then(result => {
      setTimeout(() => {
        this.scroller.scrollToBottom();
      }, 0);
    });
  }

  ngOnDestroy() {
    this.timelineService.stopReceive(this.id);
    this.timelineSubscription.unsubscribe();
  }

  private findNextAudioTypeMessage(msgId: string): MessageModel {
    let i = 0;

    for (; i < this.messages.length; i++) {
      if (this.messages[i].id === msgId) {
        break;
      }
    }

    for (i++; i < this.messages.length; i++) {
      if (this.messages[i].type === MessageType.Audio) {
        return this.messages[i];
      }
    }

    return null;
  }

  private findMessageComponent(msgId: string): MessageComponent {
    let components = this.messagesComponents.toArray();

    for (let component of components) {
      if (component.message.id === msgId) {
        return component;
      }
    }

    return null;
  }

  audioPlayEnded(msg: MessageModel) {
    if (!this.liveRoomService.isAudioAutoPlay(this.liveInfo.id)) {
      return;
    }

    let nextAudioMessage = this.findNextAudioTypeMessage(msg.id);
    if (!nextAudioMessage) {
      return;
    }
    let comp = this.findMessageComponent(nextAudioMessage.id);
    if (comp) {
      comp.playAudio();
    }
  }

  onReceivedEvents(evt: MqEvent) {
    switch (evt.event) {
      case EventType.LiveMsgUpdate:
        if (this.isOnBottom) {
          let has = this.hasNoPlayedAudio();
          this.gotoLatestMessages().then(() => {
            setTimeout(() => {
              this.scroller.scrollToBottom();
              if (!has) {
                this.autoPlayReceived();
              }
            }, 0);
          });
        } else {
          this.unreadCount++;
          this.isOnLatest = false;
        }
        break;
      case EventType.LiveClosed:
        this.liveService.getLiveInfo(this.id, true).then((result) => {
          this.liveInfo = result
        });
        break;
    }
  }

  autoPlayReceived() {

    if (this.audioPlayerService.hasPlaying) {
      return;
    }

    if (!this.audioPlayerService.userActivated) {
      return;
    }

    for (let comp of this.messagesComponents.toArray()) {
      if (!comp.audioPlayer) {
        continue;
      }
      if (comp.audioPlayer.isPlayed) {
        continue;
      }
      if (comp.message.user.uid === this.userInfo.uid) {
        continue;
      }
      return comp.playAudio();
    }
  }

  hasNoPlayedAudio(): boolean {
    return !!this.messagesComponents.toArray().filter((v) => {
      return v.audioPlayer && !v.audioPlayer.isPlayed;
    }).length;
  }

  onReceivedPraises(praisedUser: MqPraisedUser) {
    if (praisedUser.user.uid == this.userInfo.uid) {
      return
    }
    for (let idx in this.messages) {
      let message = this.messages[idx];
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

      if (messages.length >= 11) {
        messages.pop();
      }

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
    if (this.isLoading) return Promise.reject('');

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
    if (this.isLoading) return Promise.reject('');

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

      if (messages.length === 0) {
        this.isOnOldest = true;
      }

      return;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  onScroll(e: ScrollerEventModel) {
    if (this.messages.length !== 0) {
      if (e.position == ScrollerPosition.OnTop) {
        let firstMessage = this.findFirstAvailableMessage(this.messages);

        if (!firstMessage) {
          this.scroller.hideHeadLoading();
          return;
        }

        if (!this.isOnOldest) {
          this.getPrevMessages(`$lt${firstMessage.createdAt}`, 10, ['-createdAt']).finally(() => {
            this.scroller.hideHeadLoading();
          });
        } else {
          this.scroller.hideHeadLoading();
        }
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

    this.timelineService.onScroll(e);
  }

  startObserveTimelineAction() {
    this.timelineSubscription = this.timelineService.timeline$.subscribe(
      oldestOrLatest => {
        this.scroller.stopEmitScrollEvent();

        if (oldestOrLatest) {
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
    );
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
        message.type === MessageType.Nice
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
}
