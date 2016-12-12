import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";

import {Subject} from "rxjs";
import {StoreService} from "../shared/store/store.service";
import {UtilsService} from "../shared/utils/utils";

@Injectable()
export class LiveRoomService {
  tranlationExpandedSource = new Subject<boolean>();
  $tranlationExpanded: Observable<boolean> = this.tranlationExpandedSource.asObservable();

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

  toggleTranslationExpanded(liveId: string) {
    let expanded = UtilsService.getStorage('tranlastion');
    expanded[liveId] = !expanded[liveId];
    UtilsService.setStorage('tranlastion', expanded);

    this.tranlationExpandedSource.next(expanded[liveId]);
  }

  isTranslationExpanded(liveId: string): boolean {
    return !!UtilsService.getStorage('tranlastion')[liveId];
  }
}
