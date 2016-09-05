import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as AV from 'leancloud-push';

export class MqService {
  static instance: MqService
  private client: any
  private static queue: any
  private static pubing: boolean
  private static pubsubOps: pubsubOp[] = []
  private static subs: Subject<any>[] = []

  constructor() {
    this.client = AV.push({
      appId: "UGzbb42HlvESeNmziyhOWHsa-gzGzoHsz",
      appKey: "dbbAJuix9SThsVPWMkNSAQ9d"
    });

    this.client.open(this.onOpen);
    this.client.on('message', this.onMessage);
    window.client = this.client
  }

  static getInstance() {
    if (!MqService.instance) {
      MqService.instance = new MqService();
    }
    return MqService.instance;
  }

  static subscribeMessages(streamId: string, source: Subject<any>) {
    let channel = `messages_${streamId}`
    MqService.getInstance().pubsub(channel, source, true)
  }

  static subscribeComments(streamId: string, source: Subject<any>) {
    let channel = `comments_${streamId}`
    MqService.getInstance().pubsub(channel, source, true)
  }

  static subscribePraises(streamId: string, source: Subject<any>) {
    let channel = `praises_${streamId}`
    MqService.getInstance().pubsub(channel, source, true)
  }

  static unsubscribeMessages(streamId: string) {
    let channel = `messages_${streamId}`
    MqService.getInstance().pubsub(channel, null, false)
  }

  static unsubscribeComments(streamId: string) {
    let channel = `comments_${streamId}`
    MqService.getInstance().pubsub(channel, null, false)
  }

  static unsubscribePraises(streamId: string) {
    let channel = `praises_${streamId}`
    MqService.getInstance().pubsub(channel, null, false)
  }

  private pubsub(channel: string, source: Subject<any>, isSub: boolean) {
    let ops = MqService.pubsubOps
    if (ops.length > 0 && ops[ops.length - 1].isSub == isSub) {
      ops[ops.length - 1].subs[channel] = source
    } else {
      let op = new pubsubOp()
      op.isSub = isSub
      op.subs[channel] = source
      ops.push(op)
    }
    if (MqService.pubing) {
      return
    }
    this.detect()
  }

  private detect() {
    MqService.pubing = true
    let op = MqService.pubsubOps.shift()
    if (!op) {
      return
    }
    let client = MqService.getInstance().client
    if (op.isSub) {
      for (let channel in op.subs) {
        MqService.subs[channel] = op.subs[channel]
      }
      let channels = Object.keys(MqService.subs)
      client.subscribe(channels, (e) => {
        if (MqService.pubsubOps.length > 0) {
          this.detect()
          return
        }
        MqService.pubing = false
      })
    } else {
      for (let channel in op.subs) {
        MqService.subs[channel] = op.subs[channel]
      }
      let channels = Object.keys(MqService.subs)
      client.unsubscribe(channels, () => {
        for (let channel in op.subs) {
          delete (MqService.subs[channel])
        }
        if (MqService.pubsubOps.length > 0) {
          this.detect()
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
    let channel: string = data._channel
    let source: Subject<any> = MqService.subs[channel]
    if (!source) {
      return
    }
    source.next(data)
  }
}

class pubsubOp {
  isSub: boolean
  subs: Subject<any>[] = []
}
