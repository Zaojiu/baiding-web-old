import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {HttpModule, BrowserXhr, XHRBackend, Http, RequestOptions} from '@angular/http';

import {Angulartics2Module, Angulartics2GoogleTagManager} from 'angulartics2';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routes';

// import模块
import {ImageViewerModule} from "./shared/image-viewer/image-viewer.module";

// 通用组件
import {BottomPopupSelectorComponent} from './shared/bottom-popup-selector/bottom-popup-selector.component';
import {BottomPopupSelectorService} from './shared/bottom-popup-selector/bottom-popup-selector.service';
import {SharePopupComponent} from './shared/share-popup/share-popup.component';
import {SharePopupService} from './shared/share-popup/share-popup.service';
import {ModalComponent} from "./shared/modal/modal.component";
import {OperationTipsComponent} from "./shared/operation-tips/operation-tips.component";
import {ModalService} from "./shared/modal/modal.service";
import {AuthGuard} from './shared/guard/auth.guard'
import {UserInfoService} from './shared/api/user-info/user-info.service'
import {ImageViewerService} from "./shared/image-viewer/image-viewer.service";
import {TitleService} from './shared/title/title.service'
import {LiveService} from "./shared/api/live/live.service";
import {CORSBrowserXHR} from './shared/api/CORSBrowserXHR.service'
import {OperationTipsService} from "./shared/operation-tips/operation-tips.service";
import {AdminGuard} from "./shared/guard/admin.guard";
import {UserInfoResolver} from "./shared/guard/user-info.resolver";
import {WechatAudioService} from "./shared/bridge/audio/wechat-audio.service";
import {WechatAuthService} from "./shared/bridge/auth/wechat-auth.service";
import {WechatShareService} from "./shared/bridge/share/wechat-share.service";
import {AudioBridge} from "./shared/bridge/audio.interface";
import {AuthBridge} from "./shared/bridge/auth.interface";
import {ShareBridge} from "./shared/bridge/share.interface";
import {WechatConfigService} from "./shared/wechat/wechat.service";
import {PcAuthService} from "./shared/bridge/auth/pc-auth.service";
import {IosAuthService} from "./shared/bridge/auth/ios-auth.service";
import {IosShareService} from "./shared/bridge/share/ios-share.service";
import {IosBridgeService} from "./shared/ios-bridge/ios-bridge.service";
import {
  audioServiceFactory,
  authServiceFactory,
  shareServiceFactory,
  imageServiceFactory
} from "./app.factory";
import {IosAudioService} from "./shared/bridge/audio/ios-audio.service";
import {PcAudioService} from "./shared/bridge/audio/pc-audio.service";
import {PcShareService} from "./shared/bridge/share/pc-share.service";
import {ImageBridge} from "./shared/bridge/image.interface";
import {WechatImageService} from "./shared/bridge/image/wechat-image.service";
import {LiveInfoResolver} from "./shared/guard/live-info.resolver";
import {AppJumperGuard} from "./shared/guard/app-jumper.guard";
import {CustomHttp} from "./shared/api/custom-http.service";
import {LoadingModule} from "./shared/bd-loading/bd-loading.module";
import {TalkService} from "./shared/api/talk/talk.api";
import {VideoService} from "./shared/video-player/video-player.service";
import {AnalyticsService} from "./shared/analytics/analytics.service"
import {BindMobileGuard} from "./shared/guard/bind-mobile.guard";
import {TrackJsErrorHandler} from "./shared/error-handler/error-handler.service";


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager]),
    ImageViewerModule,
    LoadingModule,
  ],
  declarations: [
    AppComponent,
    BottomPopupSelectorComponent,
    SharePopupComponent,
    ModalComponent,
    OperationTipsComponent,
  ],
  providers: [
    OperationTipsService,
    WechatConfigService,
    WechatAudioService,
    WechatShareService,
    WechatAuthService,
    WechatImageService,
    IosBridgeService,
    IosAudioService,
    IosShareService,
    IosAuthService,
    PcAudioService,
    PcShareService,
    PcAuthService,
    {
      provide: AudioBridge,
      useFactory: audioServiceFactory,
      deps: [WechatAudioService, IosAudioService, PcAudioService]
    },
    {provide: AuthBridge, useFactory: authServiceFactory, deps: [WechatAuthService, IosAuthService, PcAuthService]},
    {
      provide: ShareBridge,
      useFactory: shareServiceFactory,
      deps: [WechatShareService, IosShareService, PcShareService]
    },
    {provide: ImageBridge, useFactory: imageServiceFactory, deps: [WechatImageService]},
    {
      provide: Http,
      useClass: CustomHttp,
      deps: [XHRBackend, RequestOptions, OperationTipsService]
    },
    Title,
    UserInfoResolver,
    LiveInfoResolver,
    AuthGuard,
    BindMobileGuard,
    AdminGuard,
    AppJumperGuard,
    AnalyticsService,
    UserInfoService,
    LiveService,
    TalkService,
    VideoService,
    ImageViewerService,
    TitleService,
    BottomPopupSelectorService,
    SharePopupService,
    ModalService,
    {provide: BrowserXhr, useClass: CORSBrowserXHR},
    {provide: ErrorHandler, useClass: TrackJsErrorHandler}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
