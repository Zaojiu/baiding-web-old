import {Subject} from 'rxjs/Subject';

import {UserInfoModel} from '../api/user-info/user-info.model';
import {environment} from "../../../environments/environment";

declare var AV: any;

export enum EventType {
  LiveMsgUpdate = 1,
  LiveClosed,
  LivePraise,
  LiveAudienceJoined,
  LiveCommentPushed,
}

export class MqEvent {
  event: EventType;
  info: any;
}

export class MqPraisedUser {
  user: UserInfoModel;
  msgId: string;
  praised: boolean;
  num: number;
}

export class MqComment {
  user: UserInfoModel;
  content: string;
}

export class MqService {
  static instance: MqService;
  private client: any;
  private static queue: any;
  private static pubing: boolean;
  private static pubsubOps: pubsubOp[] = [];
  private static subs: Subject<any>[] = [];

  constructor() {
    this.client = AV.push({
      appId: environment.config.lcAppId,
      appKey: environment.config.lcAppKey,
    });

    this.client.open(() => {
      this.onOpen()
    });
    this.client.on('message', (data) => {
      this.onMessage(data)
    });
    (<any>window).client = this.client; // (<any>window) avoid ts type checking
  }

  static getInstance() {
    if (!MqService.instance) {
      MqService.instance = new MqService();
    }
    return MqService.instance;
  }

  static subscribeLiveEvents(streamId: string, source: Subject<any>) {
    let channel = `live_events_${streamId}`;
    MqService.getInstance().pubsub(channel, source, true)
  }

  static subscribeLiveComments(streamId: string, source: Subject<any>) {
    let channel = `live_comments_${streamId}`;
    MqService.getInstance().pubsub(channel, source, true)
  }

  static subscribeLivePraises(streamId: string, source: Subject<any>) {
    let channel = `live_praises_${streamId}`;
    MqService.getInstance().pubsub(channel, source, true)
  }

  static unsubscribeLiveEvents(streamId: string) {
    let channel = `live_messages_${streamId}`;
    MqService.getInstance().pubsub(channel, null, false)
  }

  static unsubscribeLiveComments(streamId: string) {
    let channel = `live_comments_${streamId}`;
    MqService.getInstance().pubsub(channel, null, false)
  }

  static unsubscribeLivePraises(streamId: string) {
    let channel = `live_praises_${streamId}`;
    MqService.getInstance().pubsub(channel, null, false)
  }

  private pubsub(channel: string, source: Subject<any>, isSub: boolean) {
    let ops = MqService.pubsubOps;
    if (ops.length > 0 && ops[ops.length - 1].isSub == isSub) {
      ops[ops.length - 1].subs[channel] = source
    } else {
      let op = new pubsubOp();
      op.isSub = isSub;
      op.subs[channel] = source;
      ops.push(op)
    }
    if (MqService.pubing) {
      return
    }
    this.detect()
  }

  private detect() {
    MqService.pubing = true;
    let op = MqService.pubsubOps.shift();
    if (!op) {
      return
    }
    let client = MqService.getInstance().client;
    if (op.isSub) {
      for (let channel in op.subs) {
        MqService.subs[channel] = op.subs[channel]
      }
      let channels = Object.keys(MqService.subs);
      client.subscribe(channels, (e) => {
        if (MqService.pubsubOps.length > 0) {
          this.detect();
          return
        }
        MqService.pubing = false
      })
    } else {
      for (let channel in op.subs) {
        MqService.subs[channel] = op.subs[channel]
      }
      let channels = Object.keys(MqService.subs);
      client.unsubscribe(channels, () => {
        for (let channel in op.subs) {
          delete (MqService.subs[channel])
        }
        if (MqService.pubsubOps.length > 0) {
          this.detect();
          return
        }
        MqService.pubing = false
      })
    }
  }

  private onOpen() {
    console.log('可以接收推送');
  }

  private onMessage(data: any) {
    let channel: string = data._channel;
    let source: Subject<any> = MqService.subs[channel];
    if (!source) {
      return
    }
    source.next(data)
  }
}

class pubsubOp {
  isSub: boolean;
  subs: Subject<any>[] = [];
}
