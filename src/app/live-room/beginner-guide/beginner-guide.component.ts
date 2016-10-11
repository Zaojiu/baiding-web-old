import {Component, OnInit, Input, Output, EventEmitter,} from '@angular/core';
import {LiveService} from '../../shared/live/live.service';

@Component({
  selector: 'beginner-guide',
  templateUrl: './beginner-guide.component.html',
  styleUrls: ['./beginner-guide.compnent.scss'],
})

export class BeginnerGuideComponent {
  @Input() liveId: string;
  @Input() playGuide: boolean;
  isAdminStep1: boolean;
  isAdminStep2: boolean;
  isUserStep1: boolean;

  constructor(private liveService: LiveService) {
  }

  isEditor() {
    return this.liveService.isEditor(this.liveId);
  }

  isAudience() {
    return this.liveService.isAudience(this.liveId);
  }

  ngOnInit() {
    if (this.isAudience()) {
      this.isAdminStep1 = false;
      this.toUserStep1()
    }
  }

  toAdminStep2() {
    this.isAdminStep1 = false;
    console.log(this.isAdminStep1, "d>>>>>>d")
    this.isAdminStep2 = true;
    console.log(this.isAdminStep2, "dsdsdsadsad")
  }

  toUserStep1() {
    this.isAdminStep1 = false;
    this.isAdminStep2 = false;
    this.isUserStep1 = true;
  }

  enterLiveRoom() {
    console.log('enterliveroom')
    this.isAdminStep1 = false;
    this.isAdminStep2 = false;
    this.isUserStep1 = false;
  }

}
