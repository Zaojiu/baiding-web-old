import { Component } from '@angular/core';
/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'bd-app',
  templateUrl: 'app.component.html',
})

export class AppComponent {
  constructor() {}
}
