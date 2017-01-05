import {Directive, ElementRef, OnInit} from '@angular/core'
import {Subscription} from 'rxjs/Subscription';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Title as NgTitle}     from '@angular/platform-browser';

import {TitleService} from './title.service';
import {UtilsService} from '../utils/utils';
import {ShareBridge} from '../bridge/share.interface';


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

  private initOnRouteChange() {
    this.sub = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
      let title = '造就Now';
      let titleArr = [];
      let activeRoutes: ActivatedRoute[] = this.route.children;
      let isAsyncTitle = this.route.snapshot.data && this.route.snapshot.data['isAsyncTitle'];


      activeRoutes.forEach((route: ActivatedRoute) => {
        let activeRoute: ActivatedRoute = route;
        while (activeRoute.firstChild) {
          activeRoute = activeRoute.firstChild;
        }
        let d = activeRoute.snapshot.data;
        if (d && d['title']) titleArr.push([d['title']]);
      });

      console.log(titleArr);

      if (titleArr.length) title = titleArr.join('-');

      this.titleService.set(title);
      this.setDefaultShareInfo();
    });
  }

  private setDefaultShareInfo() {
    let routeData = this.route.snapshot.data;
    let shareTitle = routeData && routeData['shareTitle'] ? routeData['shareTitle'] : '造就Now';
    let shareDesc = routeData && routeData['shareDesc'] ? routeData['shareDesc'] : '小人物也有大声音。每个想法都值得赞赏。';
    let shareCover = routeData && routeData['shareCover'] ? routeData['shareCover'] : `${location.protocol}//${location.hostname}assets/img/zaojiu-logo.jpg`;
    let shareLink = routeData && routeData['shareLink'] ? routeData['shareLink'] : `${location.protocol}//${location.hostname}`; // 默认分享首页地址
    let isAsyncShareInfo = routeData && routeData['isAsyncShareInfo'];

    if (!isAsyncShareInfo) this.shareBridge.setShareInfo(shareTitle, shareDesc, shareCover, shareLink);
  }

  private setWechatWebviewTitle(newTitle: string) {
    document.title = newTitle;
    let i = document.createElement('iframe');
    i.src = '/favicon.ico';
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
