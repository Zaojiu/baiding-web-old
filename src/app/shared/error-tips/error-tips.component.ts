import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'error-tips',
  templateUrl: './error-tips.component.html',
  styleUrls: ['./error-tips.component.scss']
})

export class ErrorTipsComponent implements OnInit {
  content: string;
  resolver: any;
  isOpened: boolean;
  routerSubscription: Subscription;

  constructor(private router: Router) {
  }

  ngOnInit() {}
}
