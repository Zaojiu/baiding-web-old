import { Component, OnInit } from '@angular/core';
import { Live } from '../lives.classes';
import { LiveAllService } from './live-all.service';

@Component({
  providers: [ LiveAllService ],
  templateUrl: './live-all.component.html'
})

export class LiveAllComponent implements OnInit {
  lives: Live[];

  constructor(private liveService: LiveAllService) {}

  getLives() {
    this.liveService.getLives().then(lives => this.lives = lives)
  }

  ngOnInit() {
    this.getLives();
  }
}
