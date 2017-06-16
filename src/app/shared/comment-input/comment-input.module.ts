import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CommentInputComponent} from "./comment-input.component";
import {FormsModule} from "@angular/forms";
import {FormModule} from "../form/form.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormModule,
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
