import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {LiveService} from '../api/live/live.service';
import {LiveInfoModel} from "../api/live/live.model";

@Injectable()
export class LiveInfoResolver implements Resolve<LiveInfoModel> {
  constructor(private liveService: LiveService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<LiveInfoModel> {
    let liveId = route.params['id'];

    if (!liveId) {
      let parent = route.parent;

      while (parent) {
        liveId = parent.params['id'];
        if (liveId) break;
        parent = parent.parent;
      }

      if (!liveId) {
        this.router.navigate([`/404`]);
        return Promise.resolve(null);
      }
    }

    return this.liveService.getLiveInfo(liveId).then((res) => {
      return res
    }, (err) => {
      const to = encodeURIComponent(`${location.protocol}//${location.hostname}${state.url}`);
      if (err.status == 404) {
        this.router.navigate([`/404`]);
      } else {
        this.router.navigate([`/reload`], {queryParams: {backTo: to}});
      }
      return false;
    });
  }
}
