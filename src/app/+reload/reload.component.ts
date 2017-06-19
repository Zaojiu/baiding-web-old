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
    let backTo = decodeURIComponent(this.route.snapshot.queryParams['backTo']);
    if (backTo) {
      backTo = backTo.replace(host.self, '');

      if (backTo.startsWith('/')) {
        this.router.navigateByUrl(backTo);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.location.back();
    }
  }
}
