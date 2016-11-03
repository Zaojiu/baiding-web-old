import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {HttpModule, BrowserXhr} from '@angular/http';

import {LocalStorageService} from "angular2-localstorage/LocalStorageEmitter";

import {AppComponent} from './app.component';
import {ROUTES} from './app.routes';

// 程序配置
import {AppConfig} from './app.config';

// import模块
import {LiveListModule} from './live-list/live-list.module';
import {LiveRoomModule} from './live-room/live-room.module';
import {ImageViewerModule} from "./shared/image-viewer/image-viewer.module";

// 通用组件
import {BottomPopupSelectorComponent} from './shared/bottom-popup-selector/bottom-popup-selector.component';
import {BottomPopupSelectorService} from './shared/bottom-popup-selector/bottom-popup-selector.service';
import {SharePopupComponent} from './shared/share-popup/share-popup.component';
import {SharePopupService} from './shared/share-popup/share-popup.service';
import {ModalComponent} from "./shared/modal/modal.component";
import {OperationTipsComponent} from "./shared/operation-tips/operation-tips.component";
import {ModalService} from "./shared/modal/modal.service";
import {TitleSetterDirective} from './shared/title/title.directive';
import {AutofocusDirective} from './shared/autofocus/autofocus.directive';
import {AuthGuard} from './shared/guard/auth.guard'
import {UserInfoService} from './shared/api/user-info/user-info.service'
import {WechatService} from './shared/wechat/wechat.service'
import {ImageViewerService} from "./shared/image-viewer/image-viewer.service";
import {StoreService} from './shared/store/store.service'
import {TitleService} from './shared/title/title.service'
import {LiveService} from "./shared/api/live/live.service";
import {CORSBrowserXHR} from './shared/api/CORSBrowserXHR.service'
import {OperationTipsService} from "./shared/operation-tips/operation-tips.service";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ROUTES,

    LiveListModule,
    LiveRoomModule,
    ImageViewerModule
  ],
  declarations: [
    AppComponent,
    BottomPopupSelectorComponent,
    TitleSetterDirective,
    SharePopupComponent,
    AutofocusDirective,
    ModalComponent,
    OperationTipsComponent,
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
    OperationTipsService,
    {provide: BrowserXhr, useClass: CORSBrowserXHR}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
