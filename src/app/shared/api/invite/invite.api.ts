import {Injectable}     from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {InvitationModel, InvitationSummaryModel, AudienceInvitationModel} from './invite.model';
import {environment} from "../../../../environments/environment";

@Injectable()
export class InviteApiService {
  constructor(private http: Http) {
  }

  createInvititation(liveId: string, name: string, avatarKey?: string, avatarWeixinId?: string, desc?: string, title?: string): Promise<InvitationModel> {
    let data: any = {
      name: name,
    };

    if (avatarKey) data.avatarKey = avatarKey;
    if (avatarWeixinId) data.avatarWeixinId = avatarWeixinId;
    if (desc) data.desc = desc;
    if (title) data.title = title;

    let url = `${environment.config.host.io}/api/live/streams/${liveId}/invite`;

    return this.http.post(url, JSON.stringify(data)).toPromise()
      .then(res => {
        let data = res.json();
        let model = new InvitationModel();
        model.id = data.id;
        model.name = data.name;
        model.desc = data.desc;
        model.token = data.token;
        model.userInfo = null;
        return model;
      });
  }

  getInviteUploadToken(liveId: string): Promise<string> {
    const url = `${environment.config.host.io}/api/live/streams/${liveId}/invite/avatar/uptoken`;
    return this.http.post(url, null).toPromise()
      .then(response => {
        let data = response.json();
        return data.token;
      });
  }

  getInviteToken(token: string): Promise<InvitationSummaryModel> {
    const url = `${environment.config.host.io}/api/live/streams/invite_token?token=${token}`;
    return this.http.get(url).toPromise()
      .then(response => {
        let data = response.json();
        return new InvitationSummaryModel(data.name, data.desc, data.used);
      });
  }

  acceptInvitation(liveId: string, token: string): Promise<void> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${environment.config.host.io}/api/live/streams/${liveId}/accept_invite`;
    return this.http.post(url, {"token": token}, headers).toPromise()
      .then(response => {
        return;
      });
  }


  listInvitations(liveId: string): Promise<InvitationModel[]> {
    let url = `${environment.config.host.io}/api/live/streams/${liveId}/invites/by/admin?size=1000`;

    return this.http.get(url).toPromise()
      .then(res => {
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
    invitation.avatar_url = data.avatar_url;
    invitation.userInfo = users[data.acceptedBy] || null;

    return invitation;
  }

  audienceListInvitations(liveId: string): Promise<AudienceInvitationModel[]> {

    let url = `${environment.config.host.io}/api/live/streams/${liveId}/invites/by/audience?size=1000`;

    return this.http.get(url).toPromise()
      .then(res => {
        let data = res.json();
        let users = data.include.users;

        let invitations: AudienceInvitationModel[] = [];

        if (data && data.result) {
          for (let invitationData of data.result) {
            let invitation = this.audienceParseInvitation(invitationData, users);
            invitations.push(invitation);
          }
        }

        return invitations;
      });
  }

  audienceParseInvitation(data: any, users: any[]): AudienceInvitationModel {
    let invitation = new AudienceInvitationModel();
    invitation.id = data.id;
    invitation.name = data.name;
    invitation.title = data.title;
    invitation.avatar_url = data.avatar_url;
    invitation.desc = data.desc;
    invitation.userInfo = users[data.acceptedBy] || null;

    return invitation;
  }
}
