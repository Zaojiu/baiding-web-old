import {NgModule} from '@angular/core';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import {HammerInstance} from "@angular/platform-browser/src/dom/events/hammer_gestures";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule}   from '@angular/forms';

import {LiveRoomRoutingModule} from './live-room.route';
import {LiveRoomComponent} from './live-room.component';
import {CommentComponent} from './comment/comment.component';
import {AudienceToolBarComponent} from './audience-tool-bar/audience-tool-bar.component';
import {TimelineComponent} from './timeline/timeline.component';
import {MessageComponent} from './timeline/message/message.component';
import {InputtingComponent} from './timeline/message/inputting.component';
import {InputtingService} from './timeline/message/inputting.service';
import {PraisedAnimationDirective} from '../shared/praised-animation/praised-animation.directive';
import {PraisedAnimationComponent} from '../shared/praised-animation/praised-animation.component';
import {CachedLiveInfoResolver} from '../shared/guard/cached-live-info.resolver';
import {TimelineService} from './timeline/timeline.service';
import {CommentService} from './comment/comment.service';
import {MessageApiService} from "../shared/api/message/message.api";
import {ShareApiService} from "../shared/api/share/share.api";
import {QuitEditGuard} from '../shared/guard/quit-edit.guard';
import {PipeModule} from "../shared/pipe/pipe.module";
import {UploadApiService} from "../shared/api/upload/upload.api";
import {LoadingModule} from "../shared/bd-loading/bd-loading.module";
import {AudioPlayerModule} from "../shared/audio-player/audio-player.module";
import {ImageViewerModule} from "../shared/image-viewer/image-viewer.module";
import {LiveRoomInfoComponent} from "./live-room-info/live-room-info.component";
import {BeginnerGuideComponent} from "./beginner-guide/beginner-guide.component";
import {TopBarComponent} from "./top-bar/top-bar.component";
import {TopBarSwitchBtnModule} from "../shared/topbar-switch-btn/topbar-switch-btn.module";
import {SwitchBtnModule} from "../shared/switch-btn/switch-btn.module";
import {ToolTipsModule} from "../shared/tooltips/tooltips.module";
import {AnimationModule} from "../shared/animation/animation.module";
import {EditorToolBarComponent} from "./editor-tool-bar/editor-tool-bar.component";
import {RecorderComponent} from "./editor-tool-bar/recorder/recorder.component";
import {CommentApiService} from "../shared/api/comment/comment.service";
import {FileSelectorModule} from "../shared/file-selector/file-selector.module";
import {ScrollerModule} from "../shared/scroller/scroller.module";
import {AudioPlayerService} from "../shared/audio-player/audio-player.service";
import {LiveRoomInfoUpperModule} from "../shared/live-room-info-upper/live-room-info-upper.module";
import {CountDownModule} from "../shared/countdown/countdown.module";
import {HamburgerMenuModule} from "../shared/hamburger-menu/hamburger-menu.module";
import {LiveRoomService} from "./live-room.service";
import {InviteApiService} from "../shared/api/invite/invite.api";
import {CommentInputModule} from "../shared/comment-input/comment-input.module";
import {AtKeyBoardModule} from "../shared/at-keyboard/at-keyboard.module";
import {RoleAuthGuard} from "../shared/guard/role-auth.guard";
import {VideoPlayerModule} from "../shared/video-player/video-player.module";
import {PayPopupModule} from "../shared/pay-popup/pay-popup.module";
import {UserInfoCardModule} from "../shared/user-info-card/user-info-card.module";
import {BubbleComponent} from "./timeline/message/bubble.component";
import {FormModule} from "../shared/form/form.module";
import {LiveRoomTitleResolver} from "../shared/guard/title.resolver";

export class MessageHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement): HammerInstance {
    let mc = new Hammer(element);
    mc.get('press').set({time: 500});
    mc.add(new Hammer.Pinch());
    return mc;
  }
}

@NgModule({
  imports: [
    CommonModule,
    LiveRoomRoutingModule,
    FormsModule,
    FormModule,
    ReactiveFormsModule,
    PipeModule,
    LoadingModule,
    AudioPlayerModule,
    ImageViewerModule,
    SwitchBtnModule,
    TopBarSwitchBtnModule,
    ToolTipsModule,
    AnimationModule,
    FileSelectorModule,
    ScrollerModule,
    LiveRoomInfoUpperModule,
    CountDownModule,
    HamburgerMenuModule,
    CommentInputModule,
    AtKeyBoardModule,
    VideoPlayerModule,
    PayPopupModule,
    UserInfoCardModule,
  ],
  declarations: [
    LiveRoomComponent,
    CommentComponent,
    TimelineComponent,
    MessageComponent,
    BubbleComponent,
    InputtingComponent,
    EditorToolBarComponent,
    AudienceToolBarComponent,
    PraisedAnimationDirective,
    PraisedAnimationComponent,
    LiveRoomInfoComponent,
    TopBarComponent,
    BeginnerGuideComponent,
    RecorderComponent,
  ],
  providers: [
    TimelineService,
    CommentService,
    MessageApiService,
    ShareApiService,
    CommentApiService,
    CachedLiveInfoResolver,
    QuitEditGuard,
    RoleAuthGuard,
    UploadApiService,
    InputtingService,
    AudioPlayerService,
    LiveRoomService,
    InviteApiService,
    LiveRoomTitleResolver,
    {provide: HAMMER_GESTURE_CONFIG, useClass: MessageHammerConfig}
  ]
})

export class LiveRoomModule {
}
