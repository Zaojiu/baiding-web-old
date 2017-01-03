import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CommentInputComponent} from "./comment-input.component";
import {DisplayWhenFocusModule} from "../display-when-focus/display-when-focus.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    DisplayWhenFocusModule,
    FormsModule,
  ],
  declarations: [
    CommentInputComponent,
  ],
  exports: [
    CommentInputComponent,
  ],
})

export class CommentInputModule {
}
