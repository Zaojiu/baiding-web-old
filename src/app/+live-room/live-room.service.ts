import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";

import {Subject} from "rxjs";
import {StoreService} from "../shared/store/store.service";
import {UtilsService} from "../shared/utils/utils";

@Injectable()
export class LiveRoomService {
  tranlationCollapseSource = new Subject<boolean>();
  $tranlationCollapse: Observable<boolean> = this.tranlationCollapseSource.asObservable();

  constructor() {
  }

  setPushCommentStashed(text: string, messageId: string) {
    let postCommentStashed = StoreService.localStore.get('postcomment');
    postCommentStashed[messageId] = text;
    StoreService.localStore.set('postcomment', postCommentStashed);
  };

  getPushCommentStashed(messageId: string): string {
    return StoreService.localStore.get('postcomment')[messageId] || '';
  }

  setTextWordsStashed(text: string, liveId: string) {
    let textStashed = StoreService.localStore.get('textStashed');
    textStashed[liveId] = text;
    StoreService.localStore.set('textStashed', textStashed);
  };

  getTextWordsStashed(liveId: string): string {
    return StoreService.localStore.get('textStashed')[liveId] || '';
  }

  setLiveRoomAlreadyVisited() {
    StoreService.set('hasEntered', true);
  };

  getLiveRoomAlreadyVisited(): boolean {
    let enterLiveRoom = StoreService.get('hasEntered') || false;
    return enterLiveRoom;
  }

  toggleAudioAutoPlay(liveId: string) {
    let audioAutoPlay = StoreService.localStore.get('audioAutoPlay');
    audioAutoPlay[liveId] = !audioAutoPlay[liveId];
    StoreService.localStore.set('audioAutoPlay', audioAutoPlay);
  }

  isAudioAutoPlay(liveId: string): boolean {
    return !!StoreService.localStore.get('audioAutoPlay')[liveId];
  }

  toggleTranslationCollapse(liveId: string) {
    let expanded = StoreService.localStore.get('tranlastionCollapse');
    expanded[liveId] = !expanded[liveId];
    StoreService.localStore.set('tranlastionCollapse', expanded);

    this.tranlationCollapseSource.next(expanded[liveId]);
  }

  isTranslationCollapse(liveId: string): boolean {
    return !!StoreService.localStore.get('tranlastionCollapse')[liveId];
  }

  setHistoryTipsShown(liveId: string) {
    let historyTips = StoreService.localStore.get('historyTips');
    historyTips[liveId] = true;
    StoreService.localStore.set('historyTips', historyTips);
  };

  getHistoryTipsShown(liveId: string): boolean {
    return !!StoreService.localStore.get('historyTips')[liveId];
  }
}
