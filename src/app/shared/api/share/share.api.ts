import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {environment} from '../../../../environments/environment';
import {UserInfoService} from '../user-info/user-info.service';
import {URLSearchParams} from '@angular/http';

declare var $: any;

@Injectable()
export class ShareApiService {
  constructor(private http: Http, private userInfoService: UserInfoService) {
  }

  // s=<source>&u=<Uid>&rt=<shareResourceName>&rid=<shareResourceId>&t=<Unix(ShareAt)>&h=<Hash>
  accessShared(s, rt, rid, uid, t: string) {

    let url = `${environment.config.host.io}/api/live/shares`;

    let params = new URLSearchParams();
    params.set('s', s);
    params.set('u', uid + '');
    params.set('rt', rt);
    params.set('rid', rid);
    params.set('t', t + '');
    params.set('h', 'hash');

    let body = {bd: params.toString()};

    this.http.post(url, JSON.stringify(body)).toPromise();
  }

  accessSharedByRoute(route: ActivatedRoute) {
    let p = route.snapshot.queryParams;
    let s = p['s'];
    let rt = p['rt'];
    let rid = p['rid'];
    let t = p['t'];
    let uid = p['u'];
    let hash = p['h'];
    if (s && rt && rid && t && uid && hash) {
      this.accessShared(s, rt, rid, uid, t);
    }
  }

  // TODO, remove mock hash
  makeShareQuery(rt, rid: string): URLSearchParams {
    let uid = this.userInfoService.getUserInfoCache().uid;
    let t = Math.ceil(new Date().getTime() / 1000);

    let parmas = new URLSearchParams();
    parmas.set('s', 'wechat');
    parmas.set('u', uid + '');
    parmas.set('rt', rt);
    parmas.set('rid', rid);
    parmas.set('t', t + '');
    parmas.set('h', 'hash');

    return parmas;
  }
}
