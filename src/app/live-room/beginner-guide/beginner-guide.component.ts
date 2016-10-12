import {Component, OnInit, Input, Output, EventEmitter,} from '@angular/core';

@Component({
  selector: 'beginner-guide',
  templateUrl: './beginner-guide.component.html',
  styleUrls: ['./beginner-guide.compnent.scss'],
})

export class BeginnerGuideComponent {
  @Input() liveId: string;
  @Input() showAdminGuide: boolean;
  @Input() showUserGuide: boolean;
  isAdminStep2: boolean;

  toAdminStep2() {
    this.showAdminGuide = false;
    this.isAdminStep2 = true;
    this.showUserGuide = false;
  }

  enterLiveRoom() {
    this.showAdminGuide = false;
    this.isAdminStep2 = false;
    this.showUserGuide = false;
  }

}
