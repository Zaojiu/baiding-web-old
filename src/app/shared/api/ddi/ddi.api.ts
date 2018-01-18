import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {environment} from '../../../../environments/environment';

@Injectable()
export class DdiApiService {
  constructor(private http: Http) {
  }

  getResult(): Promise<any> {
    const url = `${environment.config.host.io}/api/live/ddi_test`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      return data;
    });
  }

  postAnswer(answer: Array<number>): Promise<number> {
    const url = `${environment.config.host.io}/api/live/ddi_test`;
    return this.http.post(url, {
        'answer': answer
      }
    ).toPromise().then(res => {
      let data = res.json();
      return data.result;
    });
  }

}
