import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { LiveService } from '../live/live.service';

@Injectable()
export class LiveGuard implements CanActivate {

  constructor(private liveService: LiveService, private route: ActivatedRoute) {}

  canActivate() {
    return true
  }
}
