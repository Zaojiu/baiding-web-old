import {Component}      from '@angular/core';
import {Router} from "@angular/router";

@Component({
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss'],
})

export class NotFoundComponent {
  constructor(private router: Router) {
  }

  gotoInfoCenter() {
    this.router.navigate([`/`]);
  }
}
