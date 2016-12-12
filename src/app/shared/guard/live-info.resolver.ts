import {Injectable} from '@angular/core';
import {Resolve, Router} from '@angular/router';
import {ActivatedRouteSnapshot} from '@angular/router';

import {LiveService} from '../api/live/live.service';
import {LiveInfoModel} from "../api/live/live.model";

@Injectable()
export class LiveInfoResolver implements Resolve<LiveInfoModel>{
  constructor(private liveService: LiveService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<LiveInfoModel> {
    let liveId = route.params['id'];

    return this.liveService.getLiveInfo(liveId, true).then((res)=> {
      return res
    }, ()=> {
      this.router.navigate(['/404']);
      return false
    });

  }
}
