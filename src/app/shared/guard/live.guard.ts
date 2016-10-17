import {Injectable} from '@angular/core';
import {Resolve, Router} from '@angular/router';
import {ActivatedRouteSnapshot} from '@angular/router';

import {LiveService} from '../live/live.service';

@Injectable()
export class LiveInfoResolver implements Resolve<any>{
  id: string;


  constructor(private liveService: LiveService, private router: Router) {
  }


  resolve(route: ActivatedRouteSnapshot) {
    this.id = route.params['id'];
    return this.liveService.getLiveInfo(this.id).then((res)=> {
      return res
    }, ()=> {
      this.router.navigate(['/404']);
      return false
    })

  }
}
