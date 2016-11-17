import { Component } from '@angular/core';
import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';

@Component({
  selector: 'bd-app',
  templateUrl: 'app.component.html',
})

export class AppComponent {
  constructor(angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {}
}
