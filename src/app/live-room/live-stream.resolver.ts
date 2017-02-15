import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {LiveStreamInfo} from "../shared/api/live/live.model";
import {LiveService} from "../shared/api/live/live.service";

@Injectable()
export class LiveStreamResolver implements Resolve<LiveStreamInfo>{
  constructor(private liveService: LiveService) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<LiveStreamInfo> {
    let liveId = route.parent.params['id'];

    return this.liveService.getLiveInfo(liveId).then(liveInfo => {
      return this.liveService.processStreamInfo(liveInfo);
    }).then(streamInfo => {
      return streamInfo;
    });
  }
}
