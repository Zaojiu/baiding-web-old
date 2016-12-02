import {Injectable} from '@angular/core';

declare var window: any;

@Injectable()
export class IosBridgeService {
  bridge: any;
  hasInit: boolean;

  constructor() {}

  gotoLive(liveId: string) {
    location.href = `/download.html?gotoApp=zaojiuliveapp://lives?id=${liveId}`
  }

  init(): Promise<void> {
    if (this.hasInit) return Promise.resolve();

    return new Promise((resolve, reject) => {
      let cb = (bridge: any) => {
        this.bridge = bridge;
        resolve();
      };

      if (window.WebViewJavascriptBridge) {
        this.bridge = window.WebViewJavascriptBridge;
        resolve();
        return;
      }

      if (window.WVJBCallbacks) {
        window.WVJBCallbacks.push(cb);
        return;
      }

      window.WVJBCallbacks = [cb];

      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
    });
  }
}
