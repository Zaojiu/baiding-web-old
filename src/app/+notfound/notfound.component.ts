import {Component}      from '@angular/core';
import {Router} from "@angular/router";
import {UtilsService} from "../shared/utils/utils";

@Component({
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss'],
})

export class NotFoundComponent {
  isInApp = UtilsService.isInApp;

  constructor(private router: Router) {
  }

  gotoInfoCenter() {
    this.router.navigate([`/`]);
  }
}
