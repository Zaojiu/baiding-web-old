import { NgModule, Injectable } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserXhr, HTTP_PROVIDERS } from '@angular/http';

/*
 * Platform and Environment providers/directives/pipes
 */
import { PLATFORM_PROVIDERS } from '../platform/browser';
import { ENV_PROVIDERS } from '../platform/environment';
import { ROUTES, ROUTING_PROVIDERS } from './app.routes';

// App is our top level component
import { App } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState } from './app.service';
import { AppConfig } from './app.config';

import { LiveListModule } from './live-list/live-list.module';
import { LiveRoomModule } from './live-room/live-room.module';
import { BottomPopupSelectorComponent } from './shared/bottom-popup-selector/bottom-popup-selector.component';
import { SharePopupComponent } from './shared/share-popup/share-popup.component';
import { TitleSetterDirective } from './shared/title/title.directive';
import { NotFoundComponent } from './notfound/notfound.component';
import { AuthGuard } from './shared/guard/auth.guard'
import { UserInfoService } from './shared/user-info/user-info.service'
import { WechatService } from './shared/wechat/wechat.service'
import { StoreService } from './shared/store/store.service'
import { TitleService } from './shared/title/title.service'
import { BottomPopupSelectorService } from './shared/bottom-popup-selector/bottom-popup-selector.service';
import { SharePopupService } from './shared/share-popup/share-popup.service';


// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  AppConfig,
  AuthGuard,
  UserInfoService,
  WechatService,
  StoreService,
  TitleService,
  BottomPopupSelectorService,
  SharePopupService
];

@Injectable()
class CORSBrowserXHR extends BrowserXhr{
    build(): any{
        var xhr:any = super.build();
        xhr.withCredentials = true;
        return xhr;
    }
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    BottomPopupSelectorComponent,
    NotFoundComponent,
    TitleSetterDirective,
    SharePopupComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    LiveListModule,
    LiveRoomModule,
    ROUTES
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    HTTP_PROVIDERS,
    PLATFORM_PROVIDERS,
    ENV_PROVIDERS,
    ROUTING_PROVIDERS,
    APP_PROVIDERS,
    Title,
    { provide: BrowserXhr, useClass: CORSBrowserXHR } // provide(BrowserXhr, {useClass: CORSBrowserXHR})
  ]
})

export class AppModule {}
