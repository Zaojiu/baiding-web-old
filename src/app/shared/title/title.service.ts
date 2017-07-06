import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, Router, RoutesRecognized} from "@angular/router";
import {ShareBridge} from "../bridge/share.interface";
import {appConfig, environment, host} from "../../../environments/environment";
import {UtilsService} from "../utils/utils";
import {Title}     from '@angular/platform-browser';

@Injectable()
export class TitleService {
  private titleSetter: (newTitle: string) => void;

  constructor(private router: Router, private route: ActivatedRoute,
              private shareBridge: ShareBridge, private ngTitle: Title) {
    this.titleSetter = UtilsService.isiOS && UtilsService.isInWechat ? this.setWechatWebviewTitle : ngTitle.setTitle;
    this.initOnRouteChange();
  }

  private initOnRouteChange() {
    let routeCache = null;
    const pushState = history.pushState;
    history.pushState = (data: any, title: string, url?: string | null) => {
      const route = this.getRoute(routeCache);
      const routeData = route.data;
      this.setTitle(routeData);

      pushState.call(history, data, title, url);
    };

    let firstRouteChange = false;
    this.router.events.subscribe((e) => {
      if (e instanceof RoutesRecognized) {
        routeCache = e.state.root;
      } else if (e instanceof NavigationEnd) {
        const route = this.getRoute(routeCache);
        const routeData = route.data;

        // 首次加载时不会触发pushState，需要特殊设置title;
        if (!firstRouteChange) {
          firstRouteChange = true;
          this.setTitle(routeData);
        }

        this.setDefaultShareInfo(routeData);
      }

    });
  }

  private setTitle(routeData: Data) {
    let title = appConfig.name;
    if (routeData && routeData['title']) title = `${routeData['title']} - ${appConfig.name}`;
    this.titleSetter(title);
  }

  private setDefaultShareInfo(routeData: Data) {
    let shareTitle = routeData && routeData['shareTitle'] ? routeData['shareTitle'] : environment.config.name;
    let shareDesc = routeData && routeData['shareDesc'] ? routeData['shareDesc'] : environment.config.slogan;
    let shareCover = routeData && routeData['shareCover'] ? routeData['shareCover'] : `${host.assets}/assets/img/zaojiu-logo.jpg`;
    let shareLink = routeData && routeData['shareLink'] ? routeData['shareLink'] : `${host.self}/lives`; // 默认分享首页地址
    let isAsyncShareInfo = routeData && routeData['isAsyncShareInfo'];
    let isInheritShareInfo = routeData && routeData['isInheritShareInfo'];

    if (isInheritShareInfo && this.shareBridge.title && this.shareBridge.desc && this.shareBridge.cover && this.shareBridge.link) {
      this.shareBridge.setShareInfo(this.shareBridge.title, this.shareBridge.desc, this.shareBridge.cover, this.shareBridge.link);
      return;
    }

    if (!isAsyncShareInfo) {
      this.shareBridge.setShareInfo(shareTitle, shareDesc, shareCover, shareLink);
      return;
    }
  }

  private setWechatWebviewTitle(newTitle: string) {
    document.title = newTitle;
    let i = document.createElement('iframe');
    i.src = `${host.assets}/assets/img/transparent-pixel-min.png`;
    i.style.display = 'none';
    i.onload = function () {
      setTimeout(() => {
        i.remove();
      });
    };
    document.body.appendChild(i);
  }

  private getRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (route.firstChild) route = route.firstChild;

    if (!route.component) {
      let parent = route.parent;
      while (parent) {
        if (parent.component) {
          route = parent;
          break;
        }
        parent = parent.parent;
      }
    }

    return route;
  }
}
