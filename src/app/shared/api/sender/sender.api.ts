import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {host} from "../../../../environments/environment";

export enum SmsScene {
  Login = 1,
  ResetPassWord,
  BindMobile,
}

@Injectable()
export class SenderApiService {
  constructor(private http: Http) {
  }

  sendSmsByLoginUser(mobile: string, scene: SmsScene, type = 1): Promise<void> {
    const url = `${host.io}/api/user/sms`;
    const data = {
      mobile: mobile,
      scene: scene,
      type: type,
    };

    return this.http.post(url, data).toPromise().then(res => {
      return;
    });
  }

  sendSmsByGuest(mobile: string, scene: SmsScene, type = 1): Promise<void> {
    const url = `${host.io}/api/user/login/sms`;
    const data = {
      mobile: mobile,
      scene: scene,
      type: type,
    };

    return this.http.post(url, data).toPromise().then(res => {
      return;
    });
  }
}
