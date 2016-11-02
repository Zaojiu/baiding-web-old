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
import {UtilsService} from '../../shared/utils/utils';

import {MessageComponent} from './message/message.component';
import {HackMessages} from "./hack-messages";
import * as _ from 'lodash';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit, OnDestroy {
  id: string;
  timeNow = UtilsService.now.toString();
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
              private liveService: LiveService, private messageApiService: MessageApiService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.timelineService.startReceive(this.id);
    this.timelineService.onReceivedEvents(evt => this.onReceivedEvents(evt));
    this.timelineService.onReceivedPraises(prised => this.onReceivedPraises(prised));
    this.timelineService.onReceiveMessages(message => this.onReceiveMessages(message));

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
    if (!this.liveService.isAudioAutoPlay(this.liveInfo.id)) {
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
          this.gotoLatestMessages().then(() => {
            setTimeout(() => {
              this.scroller.scrollToBottom();
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

  gotoLatestMessages(): Promise<boolean> {
    if (this.isLoading) return Promise.resolve(false);

    this.isLoading = true;

    return this.messageApiService.listMessages(this.id, '', 10).then(messages => {
      messages.reverse();

      if (!this.messages.length || this.messages[this.messages.length - 1].type !== MessageType.LiveEnd) {
        HackMessages.hackLiveEndMessage(this.liveInfo, messages);
      }

      this.scroller.resetData(messages);
      this.isOnOldest = false;
      this.isOnLatest = true;
      this.isOnBottom = true;
      this.unreadCount = 0;
      this.isLoading = false;
      return true;
    });
  }

  gotoOldestMessages(): Promise<boolean> {
    if (this.isLoading) return Promise.resolve(false);

    this.isLoading = true;

    return this.messageApiService.listMessages(this.id, '', 10, ['createdAt']).then(messages => {
      if (!this.messages.length || this.messages[0].type !== MessageType.LiveRoomInfo) {
        HackMessages.hackLiveInfoMessage(this.liveInfo, messages);
      }

      this.scroller.resetData(messages);
      this.isOnOldest = true;
      this.isOnLatest = false;
      this.isOnBottom = false;
      this.isLoading = false;
      return true;
    });
  }

  getNextMessages(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.messageApiService.listMessages(this.id, marker, limit, sorts).then(messages => {
      this.removeRepeat(messages);

      if (messages.length === 0 && this.messages[this.messages.length - 1].type !== MessageType.LiveEnd) {
        HackMessages.hackLiveEndMessage(this.liveInfo, messages);
      }

      this.scroller.appendData(messages);

      if (messages.length === 0) {
        this.isOnLatest = true;
        this.unreadCount = 0;
      }

      this.isLoading = false;
    });
  }

  getPrevMessages(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.messageApiService.listMessages(this.id, marker, limit, sorts).then(messages => {
      this.removeRepeat(messages);

      messages.reverse();

      if (messages.length === 0 && this.messages[0].type !== MessageType.LiveRoomInfo) {
        HackMessages.hackLiveInfoMessage(this.liveInfo, messages);
      }

      this.scroller.prependData(messages);

      if (messages.length === 0) {
        this.isOnOldest = true;
      }

      this.isLoading = false;
    });
  }

  onScroll(e: ScrollerEventModel) {
    if (this.messages.length !== 0) {
      if (e.position == ScrollerPosition.OnTop) {
        let firstMessage = this.findFirstAvailableMessage(this.messages);
        this.getPrevMessages(`$lt${firstMessage.createdAt}`, 10, ['-createdAt']);
      } else if (e.position == ScrollerPosition.OnBottom) {
        let lastMessage = this.findLastAvailableMessage(this.messages);
        this.getNextMessages(`$gt${lastMessage.createdAt}`, 10, ['createdAt']);
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
            message.replies.push(reply)
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
      if (message.type !== MessageType.LiveStart && message.type !== MessageType.LiveEnd &&
        message.type !== MessageType.LiveRoomInfo) {
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
