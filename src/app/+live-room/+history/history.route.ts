import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {HistoryComponent} from "./history.component";
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";
import {MessageEditorComponent} from "./message-editor/message-editor.component";
import {QuitEditGuard} from "../../shared/guard/quit-edit.guard";
import {HistoryMessageResolver} from "./history.resolver";
import {AuthGuard} from "../../shared/guard/auth.guard";
import {AdminGuard} from "../../shared/guard/admin.guard";

const route: Routes = [
  {
    path: '', component: HistoryComponent,
    data: {
      title: '历史记录',
    },
    resolve: {
      userInfo: UserInfoResolver,
      messages: HistoryMessageResolver,
    },
    children: [
      {
        path: ':messageId/edit',
        component: MessageEditorComponent,
        data: {
          title: '历史发言编辑',
        },
        resolve: {
          messages: HistoryMessageResolver,
        },
        canActivate: [AuthGuard, AdminGuard],
        canDeactivate: [QuitEditGuard],
      },
    ],
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class HistoryRoutingModule {
}

