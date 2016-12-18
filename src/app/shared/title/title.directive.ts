import {Directive, ElementRef, OnInit} from '@angular/core'
import {Subscription} from 'rxjs/Subscription';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Title as NgTitle}     from '@angular/platform-browser';

import {TitleService} from './title.service';

import {UtilsService} from '../utils/utils';


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
              private activated: ActivatedRoute,
              private ngTitle: NgTitle,
              private router: Router) {
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
    this.sub = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(_ => {
        let data = [];
        let activeRoutes: ActivatedRoute[] = this.activated.children;

        activeRoutes.forEach((route: ActivatedRoute) => {
          let activeRoute: ActivatedRoute = route;
          while (activeRoute.firstChild) {
            activeRoute = activeRoute.firstChild;
          }
          let d = activeRoute.snapshot.data;
          d && d['title'] && data.push([d['title']]);
        });

        if (data.length) {
          this.titleService.set(data.join('-'));
        }
      });

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
