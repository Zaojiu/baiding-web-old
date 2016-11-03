import {Injectable}     from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AppConfig} from '../../../app.config';
import {InvitationModel} from './invite.model';
import {PostInvitationModel} from './invite.model';

@Injectable()
export class InviteApiService {
  constructor(private http: Http, private config: AppConfig) {
  }

  getInviteToken(liveId: string): Promise<string> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/invite`;
    return this.http.post(url, null, headers).toPromise()
      .then(response => {
        let data = response.json()
        return data.token;
      });
  }

  checkInviteToken(token: string): Promise<boolean> {
    const url = `${this.config.urlPrefix.io}/api/live/streams/invite_token?token=${token}`;
    return this.http.get(url).toPromise()
      .then(response => {
        let data = response.json()
        return data.used;
      });
  }

  acceptInvitation(liveId: string, token: string): Promise<void> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/accept_invite`;
    return this.http.post(url, { "token" : token}, headers).toPromise()
      .then(response => {
        return;
      });
  }

  getInvited(liveId: string, name: string, desc: string): Promise<InvitationModel> {

    let data = new PostInvitationModel()
    data.name = name;
    data.desc = desc;
    let url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/invite`;

    return this.http.post(url, JSON.stringify(data)).toPromise()
      .then(res => {
        return;
      }).catch(res => {
      });
  }

  getInvitations(liveId: string): Promise<InvitationModel[]> {

    let url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/invites`;

    return this.http.get(url).toPromise()
      .then(res=> {
        let data = res.json();
        let users = data.include.users;

        let invitations: InvitationModel[] = [];

        if (data && data.result) {
          for (let invitationData of data.result) {
            let invitation = this.parseInvitation(invitationData, users);
            invitations.push(invitation);
          }
        }

        return invitations;
      });
  }

  parseInvitation(data: any, users: any[]): InvitationModel {
    let invitation = new InvitationModel();
    invitation.id = data.id;
    invitation.name = data.name;
    invitation.desc = data.desc;
    invitation.token = data.token;
    invitation.userInfo = users[data.acceptedBy] || null;

    return invitation;
  }
}
