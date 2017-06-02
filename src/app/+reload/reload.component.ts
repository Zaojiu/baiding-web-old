import {Component}      from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "../shared/utils/utils";
import {Location} from "@angular/common";

@Component({
  templateUrl: './reload.component.html',
  styleUrls: ['./reload.component.scss'],
})

export class ReloadComponent {
  isInApp = UtilsService.isInApp;

  constructor(private location: Location, private route: ActivatedRoute) {
  }

  goBack() {
    const backTo = this.route.snapshot.queryParams['backTo']
    if (backTo) {
      location.href = decodeURIComponent(backTo);
    } else {
      this.location.back();
    }
  }
}
