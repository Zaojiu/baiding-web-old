import {Injectable} from '@angular/core';
import {LiveType} from "../api/live/live.enums";
import {UtilsService} from "../utils/utils";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {UserInfoModel} from "../api/user-info/user-info.model";

declare var window: any;
declare var $: any;

@Injectable()
export class IosBridgeService {
  bridge: any;
  hasInit: boolean;

  constructor(private router: Router) {}

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
    let urlTree = this.router.parseUrl(state.url);
    urlTree.queryParams['appPushState'] = 'true';
    let urlHash = this.router.serializeUrl(urlTree);
    let query = {
      url: `${location.protocol}//${location.host}/#${urlHash}`,
      title: route.data['title'] || '造就直播',
    };
    
    if (this.hasInit) {
      this.bridge.callHandler('pushH5State', query);
    } else {
      this.init().then(() => {
        this.bridge.callHandler('pushH5State', query);
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
      setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
    });
  }
}
