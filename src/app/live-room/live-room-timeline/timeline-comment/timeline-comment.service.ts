import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../../app.config'

@Injectable()
export class TimelineCommmentService {
  constructor (private http: Http, private config: AppConfig) {}

  confirmPraise(liveId: string, msgId: string): Promise<void> {
    let url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/messages/${msgId}/praises`;

    return this.http.post(url, null).toPromise()
      .then(res => {
        return
      }).catch(res => {});
  }

  cancelPraise(liveId: string, msgId: string): Promise<void> {
    let url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/messages/${msgId}/praises`;

    return this.http.delete(url, null).toPromise()
      .then(res => {
        return
      }).catch(res => {});
  }
}
