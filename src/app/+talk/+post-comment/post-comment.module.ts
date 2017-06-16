import {NgModule} from '@angular/core';
import {TalkPostCommentRoutingModule} from "./post-comment.route";
import {CommonModule} from "@angular/common";
import {TalkPostCommentComponent} from "./post-comment.component";
import {ReactiveFormsModule} from "@angular/forms";
import {FormModule} from "../../shared/form/form.module";
import {TalkService} from "../../shared/api/talk/talk.api";

@NgModule({
  imports: [
    CommonModule,
    TalkPostCommentRoutingModule,
    ReactiveFormsModule,
    FormModule,
  ],
  declarations: [
    TalkPostCommentComponent,
  ],
  providers: [
    TalkService,
  ]
})

export class TalkCommentModule {
}
