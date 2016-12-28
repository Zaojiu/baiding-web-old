import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {HistoryRoutingModule} from './history.route';
import {HistoryComponent} from "./history.component";
import {PipeModule} from "../../shared/pipe/pipe.module";
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";
import {CommentInputModule} from "../../shared/comment-input/comment-input.module";
import {AtKeyBoardModule} from "../../shared/at-keyboard/at-keyboard.module";
import {AutoBlurModule} from "../../shared/auto-blur/auto-blur.module";
import {HammerGestureConfig, HAMMER_GESTURE_CONFIG} from "@angular/platform-browser";
import {HammerInstance} from "@angular/platform-browser/src/dom/events/hammer_gestures";
import {AudioPlayerModule} from "../../shared/audio-player/audio-player.module";

export class MessageHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement): HammerInstance {
    let mc = new Hammer(element, {domEvents: true});
    mc.get('press').set({time: 500});
    return mc;
  }
}

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    LoadingModule,
    HistoryRoutingModule,
    CommentInputModule,
    AtKeyBoardModule,
    AutoBlurModule,
    AudioPlayerModule,
  ],
  declarations: [
    HistoryComponent,
  ],
  providers: [
    {provide: HAMMER_GESTURE_CONFIG, useClass: MessageHammerConfig},
  ]
})

export class HistoryModule {
}
