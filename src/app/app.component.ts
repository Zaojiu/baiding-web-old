import { Component } from '@angular/core';
/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  selector: 'bd-app',
  templateUrl: 'app.component.html',
  providers: [
  ]
})

export class AppComponent {
  constructor() {}
}
