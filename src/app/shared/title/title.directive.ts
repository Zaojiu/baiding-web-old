import {Directive, ElementRef, OnInit} from '@angular/core'
import {Subscription} from 'rxjs/Subscription';
import {Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot} from '@angular/router';
import {Title as NgTitle}     from '@angular/platform-browser';

import {TitleService} from './title.service';
import {UtilsService} from '../utils/utils';
import {ShareBridge} from '../bridge/share.interface';
import {environment} from "../../../environments/environment";

declare var $: any;

@Directive({
  selector: '[titleSetter]'
})

export class TitleSetterDirective implements OnInit {
  private el: HTMLElement;
  private titleSubscription: Subscription;
  sub: Subscription;

  private setTitle: (newTitle: string) => void;

  constructor(el: ElementRef,
              private titleService: TitleService,
              private route: ActivatedRoute,
              private ngTitle: NgTitle,
              private router: Router, private shareBridge: ShareBridge) {
    this.el = el.nativeElement;
    this.setTitle = UtilsService.isiOS && UtilsService.isInWechat ? this.setWechatWebviewTitle : ngTitle.setTitle;
  }

  ngOnInit() {
    this.titleSubscription = this.titleService.title$
      .distinctUntilChanged()
      .subscribe(title => {
        this.setTitle(title);
      });

    this.initOnRouteChange();
  }

  private getRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
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

  private initOnRouteChange() {
    this.sub = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
      let title = environment.config.name;
      let titleArr = [];
      let route = this.getRoute(this.route.snapshot);
      let activeRoutes: ActivatedRouteSnapshot[] = route.children;
      let isAsyncTitle = route.data && route.data['isAsyncTitle'];

      activeRoutes.forEach((route: ActivatedRouteSnapshot) => {
        let activeRoute: ActivatedRouteSnapshot = route;
        while (activeRoute.firstChild) activeRoute = activeRoute.firstChild;
        activeRoute = this.getRoute(activeRoute);
        let d = activeRoute.data;
        if (d && d['title']) titleArr.push([d['title']]);
      });

      if (titleArr.length) title = titleArr.join('-');

      this.titleService.set(title);
      this.setDefaultShareInfo();
    });
  }

  private setDefaultShareInfo() {
    let route = this.route.snapshot;
    while (route.firstChild) route = route.firstChild;
    route = this.getRoute(route);

    let routeData = route.data;
    let shareTitle = routeData && routeData['shareTitle'] ? routeData['shareTitle'] : environment.config.name;
    let shareDesc = routeData && routeData['shareDesc'] ? routeData['shareDesc'] : environment.config.slogan;
    let shareCover = routeData && routeData['shareCover'] ? routeData['shareCover'] : `${location.protocol}//${location.hostname}assets/img/zaojiu-logo.jpg`;
    let shareLink = routeData && routeData['shareLink'] ? routeData['shareLink'] : `${location.protocol}//${location.hostname}`; // 默认分享首页地址
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
    i.src = '/assets/img/transparent-pixel-min.png';
    i.style.display = 'none';
    i.onload = function () {
      setTimeout(() => {
        i.remove();
      });
    };
    document.body.appendChild(i);
  }

  ngOnDestory() {
    this.sub.unsubscribe();
  }
}
