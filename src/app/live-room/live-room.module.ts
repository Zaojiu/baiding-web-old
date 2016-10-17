import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';

import {ROUTES} from './live-room.route';
import {LiveRoomComponent} from './live-room.component';
import {CommentComponent} from './comment/comment.component';
import {EditorBottomBarComponent} from './editor-bottom-bar/editor-bottom-bar.component';
import {AudienceBottomBarComponent} from './audience-bottom-bar/audience-bottom-bar.component';
import {TimelineComponent} from './timeline/timeline.component';
import {MessageComponent} from './timeline/message/message.component';
import {PostComponent} from './post/post.component';
import {PraisedAnimationDirective} from '../shared/praised-animation/praised-animation.directive';
import {PraisedAnimationComponent} from '../shared/praised-animation/praised-animation.component';
import {LiveResolver} from '../shared/guard/live.guard';
import {TimelineService} from './timeline/timeline.service';
import {CommentService} from './comment/comment.service';
import {MessageApiService} from "../shared/api/message.api";
import {QuitEditGuard} from '../shared/guard/quit-edit.guard';
import {FileSelectorDirective} from "../shared/file-selector/file-selector.directive";
import {PipeModule} from "../shared/pipe/pipe.module";
import {UploadApiService} from "../shared/api/upload.api";
import {LoadingModule} from "../shared/bd-loading/bd-loading.module";
import {ScrollerDirective} from "../shared/scroller/scroller.directive";
import {AudioPlayerModule} from "../shared/audio-player/audio-player.module";
import {ImageViewerModule} from "../shared/image-viewer/image-viewer.module";
import {LiveRoomInfoComponent} from "./live-room-info/live-room-info.component";
import {BeginnerGuideComponent} from "./beginner-guide/beginner-guide.component";
import {TopBarComponent} from "./top-bar/top-bar.component";
import {SwitchBtnModule} from "../shared/switch-btn/switch-btn.module";
import {ToolTipsModule} from "../shared/tooltips/tooltips.module";
import {AnimationModule} from "../shared/animation/animation.module";

@NgModule({
  imports: [
    ROUTES,
    BrowserModule,
    FormsModule,
    PipeModule,
    LoadingModule,
    AudioPlayerModule,
    ImageViewerModule,
    SwitchBtnModule,
    ToolTipsModule,
    AnimationModule,
  ],
  declarations: [
    LiveRoomComponent,
    CommentComponent,
    TimelineComponent,
    MessageComponent,
    EditorBottomBarComponent,
    AudienceBottomBarComponent,
    PostComponent,
    PraisedAnimationDirective,
    PraisedAnimationComponent,
    FileSelectorDirective,
    LiveRoomInfoComponent,
    ScrollerDirective,
    TopBarComponent,
    BeginnerGuideComponent,
  ],
  providers: [
    TimelineService,
    CommentService,
    MessageApiService,
    LiveResolver,
    QuitEditGuard,
    UploadApiService,
  ]
})

export class LiveRoomModule {
}
