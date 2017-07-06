import {Component, OnInit, Input} from '@angular/core';
import {UtilsService} from "../../shared/utils/utils";
import {StoreService} from "../../shared/store/store.service";

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
    if (this.checkGuideAlreadyShown()) this.hide();
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
    if(!this.checkGuideAlreadyShown()) StoreService.localStore.set('beginnerGuide', {isShowed: true});
  }

  checkGuideAlreadyShown() {
    let guideStore = StoreService.localStore.get('beginnerGuide');
    return guideStore && !!guideStore['isShowed'];
  }
}
