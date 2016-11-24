import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {PostApplicationModel, ApplicationModel, ApplicationStatus} from './apply.model';
import {UserInfoService} from '../user-info/user-info.service';
import {environment} from "../../../../environments/environment";

declare var $: any;

@Injectable()
export class ApplyApiService {
  constructor(private http: Http, private userInfoService: UserInfoService) {
  }

  parseApplication(data: any): ApplicationModel {
    if (!data) return null;

    let status = data.status === 'waiting' ? ApplicationStatus.Waitting : data.status === 'decline' ? ApplicationStatus.Decline : ApplicationStatus.Pass;
    let userInfo = this.userInfoService.getUserInfoCache();
    let createdAt = moment((+data.createdAt / 1e6).toString());
    let updatedAt = moment((+data.updatedAt / 1e6).toString());

    return new ApplicationModel(data.id, userInfo, data.username, data.name, data.mobile,
      data.company, data.email, data.title, status, createdAt, updatedAt);
  }

  postApplication(username: string, email: string, realName: string, company: string, title: string, phoneNumber: string): Promise<ApplicationModel> {
    let headers = new Headers({'Content-Type': 'application/json'})
    const url = `${environment.config.host.io}/api/live/streams/apply`;
    let data = new PostApplicationModel(username, email, realName, company, title, phoneNumber);

    return this.http.post(url, JSON.stringify(data), {headers: headers}).toPromise().then(res => {
      let data = res.json();
      return this.parseApplication(data);
    });
  }

  getApplication(): Promise<ApplicationModel> {
    return this.http.get(`${environment.config.host.io}/api/live/streams/apply`).toPromise().then(res => {
      let data = res.json();
      return this.parseApplication(data);
    });
  }
}
