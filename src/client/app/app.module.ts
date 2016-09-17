import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule, BrowserXhr } from '@angular/http';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

import { AppConfig } from './app.config';
import { LiveListModule } from './live-list/live-list.module';
import { LiveRoomModule } from './live-room/live-room.module';
import { NotFoundModule } from './notfound/notfound.module';
import { BottomPopupSelectorComponent } from './shared/bottom-popup-selector/bottom-popup-selector.component';
import { SharePopupComponent } from './shared/share-popup/share-popup.component';
import { TitleSetterDirective } from './shared/title/title.directive';
import { AuthGuard } from './shared/guard/auth.guard'
import { UserInfoService } from './shared/user-info/user-info.service'
import { WechatService } from './shared/wechat/wechat.service'
import { StoreService } from './shared/store/store.service'
import { TitleService } from './shared/title/title.service'
import { BottomPopupSelectorService } from './shared/bottom-popup-selector/bottom-popup-selector.service';
import { SharePopupService } from './shared/share-popup/share-popup.service';
import { AutofocusDirective } from './shared/autofocus/autofocus.directive';
import { ModalComponent } from "./shared/modal/modal.component";
import { ModalService } from "./shared/modal/modal.service";
import { CORSBrowserXHR } from './shared/api/CORSBrowserXHR.service'

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ROUTES,

    LiveListModule,
    LiveRoomModule,
    NotFoundModule
  ],
  declarations: [
    AppComponent,
    BottomPopupSelectorComponent,
    TitleSetterDirective,
    SharePopupComponent,
    AutofocusDirective,
    ModalComponent
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '<%= APP_BASE %>' },
    Title,
    AppConfig,
    AuthGuard,
    UserInfoService,
    WechatService,
    StoreService,
    TitleService,
    BottomPopupSelectorService,
    SharePopupService,
    ModalService,
    { provide: BrowserXhr, useClass: CORSBrowserXHR }
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule {}
