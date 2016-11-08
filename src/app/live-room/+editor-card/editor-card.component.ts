import {Input, Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {EditorCardService} from './editor-card.service';
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";

@Component({
  selector: 'editor-card',
  templateUrl: 'editor-card.component.html',
  styleUrls: ['editor-card.component.scss']
})

export class EditorCardComponent implements OnInit {
  isPopup: boolean;
  @Input() liveInfo: LiveInfoModel;
  msgUser: UserInfoModel;
  msgUserSub: Subscription;

  constructor(private editorCardService: EditorCardService) {
  }

  ngOnInit() {
    // 此组件由于是全局组件，生命周期与app一样长，所以不需退订。
    this.msgUserSub = this.editorCardService .popup$.subscribe((user) => {
        this.isPopup = true;
        this.msgUser = user;
      }
    );
  }

  ngOnDestroy() {
    if (this.msgUserSub) {
      this.msgUserSub.unsubscribe();
    }
  }
}
