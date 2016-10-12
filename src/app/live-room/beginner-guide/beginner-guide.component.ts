import {Component, OnInit, Input} from '@angular/core';
import {LocalStorage} from "angular2-localstorage/WebStorage";

@Component({
  selector: 'beginner-guide',
  templateUrl: './beginner-guide.component.html',
  styleUrls: ['./beginner-guide.compnent.scss'],
})

export class BeginnerGuideComponent implements OnInit {
  @Input() liveId: string;
  @Input() showAdminGuide: boolean;
  @Input() showUserGuide: boolean;
  isAdminStep2: boolean;
  @LocalStorage() public beginnerGuideShowed: Object = {};


  ngOnInit() {
    if (this.getGuideAlreadyShown()) {
      this.hide();
    }
  }

  toAdminStep2() {
    this.showAdminGuide = false;
    this.isAdminStep2 = true;
    this.showUserGuide = false;
  }

  hide() {
    this.showAdminGuide = false;
    this.isAdminStep2 = false;
    this.showUserGuide = false;
  }


  setGuideAlreadyShown() {
    this.beginnerGuideShowed['guideAlreadyShown'] = true
  }

  getGuideAlreadyShown() {
    let guideShowed = this.beginnerGuideShowed['guideAlreadyShown'];

    if (!guideShowed) {
      this.setGuideAlreadyShown();
    }

    return guideShowed;
  }
}
