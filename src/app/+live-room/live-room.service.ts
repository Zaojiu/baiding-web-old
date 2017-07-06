import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";

import {Subject} from "rxjs";
import {StoreService} from "../shared/store/store.service";

@Injectable()
export class LiveRoomService {
  tranlationCollapseSource = new Subject<boolean>();
  $tranlationCollapse: Observable<boolean> = this.tranlationCollapseSource.asObservable();

  constructor() {
  }

  setPushCommentStashed(text: string, messageId: string) {
    let postCommentStashed = StoreService.localStore.get('postcomment') || {};
    postCommentStashed[messageId] = text;
    StoreService.localStore.set('postcomment', postCommentStashed);
  };

  getPushCommentStashed(id: string): string {
    const commentCache = StoreService.localStore.get('postcomment') || {};
    return commentCache[id] || '';
  }

  setTextWordsStashed(text: string, liveId: string) {
    let textStashed = StoreService.localStore.get('textStashed') || {};
    textStashed[liveId] = text;
    StoreService.localStore.set('textStashed', textStashed);
  };

  getTextWordsStashed(liveId: string): string {
    const messageCache = StoreService.localStore.get('textStashed') || {};
    return messageCache[liveId] || '';
  }

  toggleAudioAutoPlay(liveId: string) {
    const audioAutoPlay = StoreService.localStore.get('audioAutoPlay') || {};
    audioAutoPlay[liveId] = !audioAutoPlay[liveId];
    StoreService.localStore.set('audioAutoPlay', audioAutoPlay);
  }

  isAudioAutoPlay(liveId: string): boolean {
    const audioAutoPlayCache = StoreService.localStore.get('audioAutoPlay') || {};
    return !!audioAutoPlayCache[liveId];
  }

  toggleTranslationCollapse(liveId: string) {
    const expanded = StoreService.localStore.get('tranlastionCollapse') || {};
    expanded[liveId] = !expanded[liveId];
    StoreService.localStore.set('tranlastionCollapse', expanded);

    this.tranlationCollapseSource.next(expanded[liveId]);
  }

  isTranslationCollapse(liveId: string): boolean {
    const tranlastionCollapse = StoreService.localStore.get('tranlastionCollapse') || {};
    return !!tranlastionCollapse[liveId];
  }

  setHistoryTipsShown(liveId: string) {
    const historyTips = StoreService.localStore.get('historyTips') || {};
    historyTips[liveId] = true;
    StoreService.localStore.set('historyTips', historyTips);
  };

  getHistoryTipsShown(liveId: string): boolean {
    const historyTips = StoreService.localStore.get('historyTips') || {};
    return !!historyTips[liveId];
  }
}
