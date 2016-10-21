export class WechatConfigModel {
  debug: boolean;
  appId: number;
  nonceStr: string;
  timestamp: string;
  signature: string;
  jsApiList: string[];
}

export class WechatAudioModel {
  localId: string;
  serverId: string;
  translateResult: string;
  duration: number;
}

