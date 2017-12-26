import {Injectable} from '@angular/core';
import {LiveType} from "../api/live/live.enums";
import {UtilsService} from "../utils/utils";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {environment, host} from "../../../environments/environment";

declare var window: any;
declare var $: any;

@Injectable()
export class IosBridgeService {
  bridge: any;
  hasInit: boolean;

  constructor() {
  }

  gotoLive(liveId: string, liveType: LiveType, role: string) {
    let query = {
      id: liveId,
      type: liveType,
      role: role,
    };

    if (UtilsService.isInApp) {
      if (this.hasInit) {
        this.bridge.callHandler('lives', query);
      } else {
        this.init().then(() => {
          this.bridge.callHandler('lives', query);
        });
      }
    } else {
      let gotoApp = encodeURIComponent(`zaojiuliveapp://lives?${$.param(query)}`);
      location.href = `/download.html?gotoApp=${gotoApp}`;
    }
  }

  pushH5State(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let query: any = {
      url: `${host.self}${state.url}`,
      title: route.data['title'] || environment.config.name,
    };

    if (this.hasInit) {
      this.bridge.callHandler('pushH5State', query);
    } else {
      this.init().then(() => {
        this.bridge.callHandler('pushH5State', query);
      });
    }
  }

  popH5State(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let query: any = {
      url: `${host.self}${state.url}`,
      title: route.data['title'] || environment.config.name,
    };

    if (this.hasInit) {
      this.bridge.callHandler('popH5State', query);
    } else {
      this.init().then(() => {
        this.bridge.callHandler('popH5State', query);
      });
    }
  }

  gotoRoom(id: string, data: any) {
    let query: any = {
      id: id,
      data: data,
    };

    if (this.hasInit) {
      this.bridge.callHandler('gotoRoom', query);
    } else {
      this.init().then(() => {
        this.bridge.callHandler('gotoRoom', query);
      });
    }
  }

  // 收藏页面的讲者点击后跳转到原生讲者详情
  gotoSpeaker(id: string) {
    if (this.hasInit) {
      this.bridge.callHandler('pushSpeaker', id);
    } else {
      this.init().then(() => {
        this.bridge.callHandler('pushSpeaker', id);
      });
    }
  }

  copyText(text: string) {
    return new Promise((resolve, reject) => {
      if (this.hasInit) {
        this.bridge.callHandler('copyText', {
          title: text,
        }, (result) => {
          resolve(result);
        }, (err) => {
          reject(err);
        });
      } else {
        this.init().then(() => {
          this.bridge.callHandler('copyText', {
            title: text,
          }, (result) => {
            resolve(result);
          }, (err) => {
            reject(err);
          });
        });
      }
    });
  }

  onClose(cb: () => void) {
    if (this.hasInit) {
      this.bridge.registerHandler('onClose', cb);
    } else {
      this.init().then(() => {
        this.bridge.registerHandler('onClose', cb);
      });
    }
  }

  offClose() {
    if (this.hasInit) {
      this.bridge.registerHandler('onClose');
    } else {
      this.init().then(() => {
        this.bridge.registerHandler('onClose');
      });
    }
  }

  onRefreshPage(cb: (url: any) => void) {
    if (this.hasInit) {
      this.bridge.registerHandler('refreshPage', cb);
    } else {
      this.init().then(() => {
        this.bridge.registerHandler('refreshPage', cb);
      });
    }
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
      setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
      }, 0);
    });
  }
}
