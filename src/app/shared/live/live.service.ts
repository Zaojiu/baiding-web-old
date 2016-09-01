import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { LiveInfoModel } from './live.model';
import { AppConfig } from '../../app.config'

@Injectable()
export class LiveService {
  private mockUrl: string = '../../../assets/mock-data/live-room-info.json';
  constructor (private http: Http, private config: AppConfig) {}

  getLiveInfo(id: string): Promise<LiveInfoModel> {
    const url = `${this.config.urlPrefix.io}/api/streams/${id}`;
    return this.http.get(url).toPromise()
      .then(response => response.json() as LiveInfoModel);
      // .catch(this.handleError);
  }
}
