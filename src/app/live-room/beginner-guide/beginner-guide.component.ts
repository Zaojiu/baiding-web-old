import {Component, OnInit, Input} from '@angular/core';
import {UtilsService} from "../../shared/utils/utils";

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

  ngOnInit() {
    if (this.checkGuideAlreadyShown()) {
      this.hide();
    } else {
      UtilsService.setStorage('beginnerGuide', {isShowed: true});
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

  checkGuideAlreadyShown() {
    let guideShowed = !!UtilsService.getStorage('beginnerGuide')['isShowed'];
    return guideShowed;
  }
}
