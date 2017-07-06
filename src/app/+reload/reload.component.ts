import {Component}      from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "../shared/utils/utils";
import {Location} from "@angular/common";
import {host} from "../../environments/environment";

@Component({
  templateUrl: './reload.component.html',
  styleUrls: ['./reload.component.scss'],
})

export class ReloadComponent {
  isInApp = UtilsService.isInApp;

  constructor(private location: Location, private route: ActivatedRoute, private router: Router) {
  }

  goBack() {
    let redirectTo = this.route.snapshot.queryParams['redirectTo'];
    redirectTo = redirectTo.replace(host.self, '');
    if (redirectTo === '/') redirectTo = '/lives';
    if (redirectTo && !redirectTo.startsWith('/')) redirectTo = '/lives';

    if (redirectTo) {
      this.router.navigateByUrl(redirectTo);
    } else {
      this.location.back();
    }
  }
}
