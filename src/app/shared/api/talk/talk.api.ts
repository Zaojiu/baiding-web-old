import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {StoreService} from '../../store/store.service';
import {environment} from "../../../../environments/environment";
import {TalkInfoModel, TalkCommentModel} from "./talk.model";
import {DomSanitizer} from "@angular/platform-browser";
import {DataQueue} from "../data-queue.model";

@Injectable()
export class TalkService {
  private talkInfoQueue: {[id: string]: DataQueue} = {};

  constructor(private http: Http, private sanitizer: DomSanitizer) {
  }

  getTalkInfo(id: string, needRefresh = false): Promise<TalkInfoModel> {
    let talks = StoreService.get('talks') || {};
    let talksInfoCache = talks[id];
    if (talksInfoCache && !needRefresh) return Promise.resolve(talksInfoCache);

    if (!this.talkInfoQueue[id]) this.talkInfoQueue[id] = new DataQueue;

    const queue = this.talkInfoQueue[id];

    if (!needRefresh) {
      if (queue.isLock) {
        return new Promise((resolve, reject) => {
          queue.append(resolve, reject);
        });
      } else {
        queue.lock();
      }
    }

    const url = `${environment.config.host.io}/api/live/objects/${id}`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();

      let talkInfo = new TalkInfoModel(data.object, data.users, data.speakers, data.categories, data.tags, data.currentUserInfo, this.sanitizer);

      let talks = StoreService.get('talks') || {};
      talks[id] = talkInfo;
      StoreService.set('talks', talks);

      if (!needRefresh && queue.isLock) queue.resolve(talkInfo);

      return talkInfo;
    }, (resp) => {
      if (!needRefresh && queue.isLock) queue.reject(resp);
      return Promise.reject(resp);
    }).finally(() => {
      queue.unlock();
    });
  }

  listComments(id: string, size = 20, marker = '', sorts = ['-createdAt']): Promise<TalkCommentModel[]> {
    var query = {
      createdAt: marker,
      size: size,
      sorts: sorts.join(','),
    };

    const url = `${environment.config.host.io}/api/live/objects/${id}/comments?${$.param(query)}`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let result = data.result;
      let users = data.include ? data.include.users : null;
      let comments: TalkCommentModel[] = [];

      if (!result || !result.length) return [];

      for (let item of result) {
        comments.push(new TalkCommentModel(item, users));
      }

      return comments;
    });
  }

  postComment(id: string, content: string, parentId?: string): Promise<void> {
    let query: any = {
      content: content
    };

    if (parentId) query.parentId = parentId;

    const url = `${environment.config.host.io}/api/live/objects/${id}/comments`;
    return this.http.post(url, query).toPromise().then(res => {
      return;
    });
  }

  favorite(id: string): Promise<void> {
    const url = `${environment.config.host.io}/api/live/my/favorited/objects/${id}`;
    return this.http.post(url, null).toPromise().then(res => {
      return;
    });
  }

  unfavorite(id: string): Promise<void> {
    const url = `${environment.config.host.io}/api/live/my/favorited/objects/${id}`;
    return this.http.delete(url).toPromise().then(res => {
      return;
    });
  }

  praise(id: string): Promise<void> {
    const url = `${environment.config.host.io}/api/live/my/praised/objects/${id}`;
    return this.http.post(url, null).toPromise().then(res => {
      return;
    });
  }

  unpraise(id: string): Promise<void> {
    const url = `${environment.config.host.io}/api/live/my/praised/objects/${id}`;
    return this.http.delete(url).toPromise().then(res => {
      return;
    });
  }
}
