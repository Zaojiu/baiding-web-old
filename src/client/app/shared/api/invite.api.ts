import { Injectable }     from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AppConfig } from '../../app.config'

@Injectable()
export class InviteApiService {
  constructor (private http: Http, private config: AppConfig) {}

  getInviteToken(liveId: string): Promise<string> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/invite`;
    return this.http.post(url, null, headers).toPromise()
      .then(response => {
        let data = response.json()
        return data.token
      })
  }

  checkInviteToken(token: string): Promise<boolean> {
    const url = `${this.config.urlPrefix.io}/api/live/streams/invite_token?token=${token}`;
    return this.http.get(url).toPromise()
      .then(response => {
        let data = response.json()
        return data.used
      })
  }

  acceptInvitation(liveId: string, token: string): Promise<void> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/accept_invite`;
    return this.http.post(url, {"token": token}, headers).toPromise()
      .then(response => { return })
  }
}
