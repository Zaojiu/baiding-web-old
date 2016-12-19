import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';

import {LiveService} from '../api/live/live.service';
import {LiveInfoModel} from "../api/live/live.model";
import {LiveRoomComponent} from "../../live-room/live-room.component";

@Injectable()
export class LiveInfoResolver implements Resolve<LiveInfoModel> {
  constructor(private liveService: LiveService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<LiveInfoModel> {
    let liveId = route.params['id'];

    return this.liveService.getLiveInfo(liveId).then((res)=> {
      return res
    }, () => {
      this.router.navigate(['/404']);
      return false;
    });

  }
}
