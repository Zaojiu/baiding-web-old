import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { MessageModel } from '../../shared/api/message.model';
import { TimelineService } from './timeline.service';
import { UserInfoModel } from '../../shared/user-info/user-info.model';
import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';
import { MqPraisedUser, MqEvent, EventType } from '../../shared/mq/mq.service';
import { MessageApiService } from "../../shared/api/message.api";
import {ScrollerDirective} from "../../shared/scroller/scroller.directive";
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";
import {ScrollerPosition} from "../../shared/scroller/scroller.enums";

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})

export class TimelineComponent implements OnInit, OnDestroy {
  id: string;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  @ViewChild(ScrollerDirective) scroller: ScrollerDirective;
  messages: MessageModel[] = [];
  receviedReplySubscription: Subscription;
  timelineSubscription: Subscription;
  isOnLatest: boolean;
  isOnNewest: boolean;
  isLoading: boolean;
  countdownTimer: any;

  constructor(private route: ActivatedRoute, private timelineService: TimelineService,
              private liveService: LiveService, private messageApiService: MessageApiService) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (!this.isStarted()) {
      this.countdownTimer = setInterval(() => {
        let startedAt = this.liveInfo.expectStartAt.indexOf('.00') === -1 ? `${this.liveInfo.expectStartAt}.00` : this.liveInfo.expectStartAt.replace('.00', '');
        this.liveInfo.expectStartAt = startedAt;
      }, 60000);
    }

    this.timelineService.startReceive(this.id);
    this.timelineService.onReceivedEvents(evt => this.onReceivedEvents(evt));
    this.timelineService.onReceivedPraises(prised => this.onReceivedPraises(prised));
    this.timelineService.onReceiveMessages(message => this.onReceiveMessages(message));

    this.startObserveTimelineAction();
    this.startReceiveReply();
    this.gotoLatestMessages().then(result => setTimeout(() => {this.scroller.scrollToBottom()}, 500));
  }

  ngOnDestroy() {
    this.timelineService.stopReceive(this.id);
    this.timelineSubscription.unsubscribe();
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    };
  }

  isStarted(): boolean {
    let expectStartAt = moment(this.liveInfo.expectStartAt)
    let isZero = expectStartAt.isSame(moment('0001-01-01T00:00:00Z'))
    return moment().isSameOrAfter(expectStartAt) || isZero
  }

  isClosed(): boolean {
    let closedAt = moment(this.liveInfo.closedAt)
    let isZero = closedAt.isSame(moment('0001-01-01T00:00:00Z'))
    return moment().isSameOrAfter(closedAt) && !isZero
  }

  onReceivedEvents(evt: MqEvent) {
    switch (evt.event) {
      case EventType.LiveMsgUpdate:
        this.gotoLatestMessages();
        break;
      case EventType.LivePraise:
        // TODO
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
        message.pushPraisedUser(praisedUser.user, praisedUser.praised, praisedUser.num)
      }
    }
  }

  onReceiveMessages(message: MessageModel) {
    for (let idx in this.messages) {
      if (this.messages[idx].id == message.id) {
        return
      }
    }
    this.messages.push(message)
  }

  gotoLatestMessages(): Promise<boolean> {
    if (this.isLoading) return Promise.resolve(false);

    this.isLoading = true;

    return this.messageApiService.listMessages(this.id).then(messages => {
      messages = messages.reverse();
      this.messages = messages;
      this.isOnNewest = false;
      this.isOnLatest = true;
      this.isLoading = false;
      return true;
    });
  }

  gotoOldestMessages(): Promise<boolean> {
    if (this.isLoading) return Promise.resolve(false);

    this.isLoading = true;

    return this.messageApiService.listMessages(this.id, '', 20, ['createdAt']).then(messages => {
      this.messages = messages;
      this.isOnNewest = true;
      this.isOnLatest = false;
      this.isLoading = false;
      return true;
    });
  }

  getNextMessages(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.messageApiService.listMessages(this.id, marker, limit, sorts).then(messages => {
      this.removeRepeat(messages);
      for (let message of messages) {
        this.messages.push(message);
      }

      if (messages.length === 0) {
        this.isOnLatest = true;
      }

      this.isLoading = false;
    });
  }

  getPrevMessages(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.messageApiService.listMessages(this.id, marker, limit, sorts).then(messages => {
      this.removeRepeat(messages);
      for (let message of messages) {
        this.messages.unshift(message);
      }

      if (messages.length === 0) {
        this.isOnNewest = true;
      }

      this.isLoading = false;
    });
  }

  onScroll(e: ScrollerEventModel) {
    if (e.position == ScrollerPosition.OnTop) {
      if (this.messages.length === 0) return;
      let firstMessage = this.messages[0];
      this.getPrevMessages(`$lt${firstMessage.createdAt}`, 20, ['-createdAt']);
    } else if (e.position == ScrollerPosition.OnBottom) {
      if (this.messages.length === 0) return;
      let lastMessage = this.messages[this.messages.length - 1];
      this.getNextMessages(`$gt${lastMessage.createdAt}`, 20, ['createdAt']);
    }
  }

  startObserveTimelineAction() {
    this.timelineSubscription = this.timelineService.timeline$.subscribe(
      oldestOrLatest => {
        this.scroller.stopEmitScrollEvent();

        if (oldestOrLatest) {
          this.gotoOldestMessages().then(result => {
            if (result) {
              setTimeout(() => {this.scroller.scrollToTop()}, 500)
              this.scroller.startEmitScrollEvent();
            }
          });
        } else {
          this.gotoLatestMessages().then(result => {
            if (result) {
              setTimeout(() => {this.scroller.scrollToBottom()}, 500)
              this.scroller.startEmitScrollEvent();
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
    let idsX = {}
    for (let idx in this.messages) {
      idsX[this.messages[idx].id] = idx
    }
    let idY = {}
    let idxs = []
    for (let message of messages) {
      idY[message.id] = true
      if (idsX[message.id] !== undefined) {
        idxs.push(idsX[message.id])
      }
    }
    idxs = idxs.sort().reverse()
    for (let idx of idxs) {
      this.messages.splice(idx, 1)
    }
  }
}
