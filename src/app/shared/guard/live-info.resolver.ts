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

    return this.liveService.getLiveInfo(liveId).then((res)=> {
      return res
    }, () => {
      this.router.navigate([`404`]);
      return false;
    });
  }
}
