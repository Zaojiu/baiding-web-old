import {Component, OnInit} from '@angular/core';
import {PayPopupService} from './pay-popup.service';

@Component({
  selector: 'pay-popup',
  templateUrl: './pay-popup.component.html',
  styleUrls: ['./pay-popup.component.scss']
})

export class PayPopupComponent implements OnInit {
  isPopup: boolean;
  qrcodeGenerator: any;
  qrcodeImage: string;

  constructor(private payPopupService: PayPopupService) {
  }

  ngOnInit() {
    // 此组件由于是全局组件，生命周期与app一样长，所以不需退订。
    this.payPopupService.switch$.subscribe((status) => {
      this.qrcodeImage = '';
      this.isPopup = status;
    });

    this.payPopupService.setPayUrl$.subscribe(payUrl => {
      if (!this.qrcodeGenerator) {
        System.import('yaqrcode').then(yaqrcode => {
          this.qrcodeGenerator = yaqrcode;
          this.qrcodeImage = this.qrcodeGenerator(payUrl, {size: 150});
        });

        return;
      }

      this.qrcodeImage = this.qrcodeGenerator(payUrl, {size: 150});
    });
  }

  close() {
    this.isPopup = false;
    this.payPopupService.onClose();
  }
}
