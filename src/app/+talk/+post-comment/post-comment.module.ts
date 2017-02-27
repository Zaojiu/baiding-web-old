import {NgModule} from '@angular/core';
import {TalkPostCommentRoutingModule} from "./post-comment.route";
import {CommonModule} from "@angular/common";
import {TalkPostCommentComponent} from "./post-comment.component";
import {ReactiveFormsModule} from "@angular/forms";
import {AutofocusFirstInvalidInputModule} from "../../shared/first-invalid/first-invalid.module";
import {FormModule} from "../../shared/form/form.module";
import {AutoresizeModule} from "../../shared/autoresize/autoresize.module";
import {TalkService} from "../../shared/api/talk/talk.api";

@NgModule({
  imports: [
    CommonModule,
    TalkPostCommentRoutingModule,
    ReactiveFormsModule,
    AutofocusFirstInvalidInputModule,
    FormModule,
    AutoresizeModule,
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
