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
    let postCommentStashed = UtilsService.getStorage('postcomment');
    postCommentStashed[messageId] = text;
    UtilsService.setStorage('postcomment', postCommentStashed);
  };

  getPushCommentStashed(messageId: string): string {
    return UtilsService.getStorage('postcomment')[messageId] || '';
  }

  setTextWordsStashed(text: string, liveId: string) {
    let textStashed = UtilsService.getStorage('textStashed');
    textStashed[liveId] = text;
    UtilsService.setStorage('textStashed', textStashed);
  };

  getTextWordsStashed(liveId: string): string {
    return UtilsService.getStorage('textStashed')[liveId] || '';
  }

  setLiveRoomAlreadyVisited() {
    StoreService.set('hasEntered', true);
  };

  getLiveRoomAlreadyVisited(): boolean {
    let enterLiveRoom = StoreService.get('hasEntered') || false;
    return enterLiveRoom;
  }

  toggleAudioAutoPlay(liveId: string) {
    let audioAutoPlay = UtilsService.getStorage('audioAutoPlay');
    audioAutoPlay[liveId] = !audioAutoPlay[liveId];
    UtilsService.setStorage('audioAutoPlay', audioAutoPlay);
  }

  isAudioAutoPlay(liveId: string): boolean {
    return !!UtilsService.getStorage('audioAutoPlay')[liveId];
  }

  toggleTranslationCollapse(liveId: string) {
    let expanded = UtilsService.getStorage('tranlastionCollapse');
    expanded[liveId] = !expanded[liveId];
    UtilsService.setStorage('tranlastionCollapse', expanded);

    this.tranlationCollapseSource.next(expanded[liveId]);
  }

  isTranslationCollapse(liveId: string): boolean {
    return !!UtilsService.getStorage('tranlastionCollapse')[liveId];
  }
}
