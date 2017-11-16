import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {host} from "../../../../environments/environment";
import {CustomHttp} from "../custom-http.service";

export enum SmsScene {
  Login = 1,
  ResetPassword,
  BindMobile,
  Signup,
}

export enum SmsType {
  Text = 1,
  Voice,
}

@Injectable()
export class SenderApiService {
  constructor(private http: CustomHttp) {
  }

  sendSmsByLoginUser(mobile: string, scene: SmsScene, type = SmsType.Text): Promise<void> {
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

  sendSmsByGuest(mobile: string, scene: SmsScene, type = SmsType.Text, codeMap?: {[key: number]: string}): Promise<void> {
    const url = `${host.io}/api/user/login/sms`;
    const data = {
      mobile: mobile,
      scene: scene,
      type: type,
    };

    return this.http.post(url, data, {customCodeMap: codeMap}).toPromise().then(res => {
      return;
    });
  }
}
