import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {TalkInfoModel} from "../api/talk/talk.model";
import {TalkService} from "../api/talk/talk.api";
import {host} from "../../../environments/environment";

@Injectable()
export class TalkInfoResolver implements Resolve<TalkInfoModel> {
  constructor(private talkService: TalkService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<TalkInfoModel> {
    let talkId = route.params['id'];

    if (!talkId) {
      let parent = route.parent;
      while (parent) {
        talkId = parent.params['id'];
        if (talkId) break;
        parent = parent.parent;
      }

      if (!talkId) return Promise.resolve(null);
    }

    return this.talkService.getTalkInfo(talkId).then(talkInfo => {
      return talkInfo;
    }, () => {
      const to = `${host.self}${state.url}`;
      this.router.navigate([`/reload`], {queryParams: {redirectTo: to}});
      return null;
    });
  }
}
