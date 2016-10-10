import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule, BrowserXhr } from '@angular/http';

import { LocalStorageService } from "angular2-localstorage/LocalStorageEmitter";

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

// 程序配置
import { AppConfig } from './app.config';

// import模块
import { LiveListModule } from './live-list/live-list.module';
import { LiveRoomModule } from './live-room/live-room.module';

// 通用组件
import { BottomPopupSelectorComponent } from './shared/bottom-popup-selector/bottom-popup-selector.component';
import { BottomPopupSelectorService } from './shared/bottom-popup-selector/bottom-popup-selector.service';
import { SharePopupComponent } from './shared/share-popup/share-popup.component';
import { SharePopupService } from './shared/share-popup/share-popup.service';
import { ModalComponent } from "./shared/modal/modal.component";
import { ModalService } from "./shared/modal/modal.service";
import { TitleSetterDirective } from './shared/title/title.directive';
import { AutofocusDirective } from './shared/autofocus/autofocus.directive';
import { AuthGuard } from './shared/guard/auth.guard'
import { UserInfoService } from './shared/user-info/user-info.service'
import { WechatService } from './shared/wechat/wechat.service'
import { ImageViewerComponent } from "./shared/image-viewer/image-viewer.component";
import { ImageViewerService } from "./shared/image-viewer/image-viewer.service";
import { StoreService } from './shared/store/store.service'
import { TitleService } from './shared/title/title.service'
import { LiveService } from "./shared/live/live.service";
import { CORSBrowserXHR } from './shared/api/CORSBrowserXHR.service'

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ROUTES,

    LiveListModule,
    LiveRoomModule,
  ],
  declarations: [
    AppComponent,
    BottomPopupSelectorComponent,
    TitleSetterDirective,
    SharePopupComponent,
    ImageViewerComponent,
    AutofocusDirective,
    ModalComponent
  ],
  providers: [
    Title,
    AppConfig,
    AuthGuard,
    UserInfoService,
    WechatService,
    StoreService,
    ImageViewerService,
    TitleService,
    BottomPopupSelectorService,
    SharePopupService,
    ModalService,
    LocalStorageService,
    LiveService,
    { provide: BrowserXhr, useClass: CORSBrowserXHR }
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule {}
