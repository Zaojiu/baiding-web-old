import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {AuthBridge} from "../auth.interface";

@Injectable()
export class PcAuthService implements AuthBridge {
  constructor(private router: Router) {
  }

  auth(redirectTo?: string) {
    redirectTo = redirectTo || this.router.routerState.snapshot.url;
    this.router.navigate(['/signin'], {queryParams: {redirectTo: redirectTo}});
  }
}
