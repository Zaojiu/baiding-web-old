import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {EventApiService} from "../../shared/api/event/ticket.api";
import {EventModel} from "../../shared/api/event/ticket.model";
import {Money, UtilsService} from "../../shared/utils/utils";

@Component({
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss'],
})

export class BuyComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private eventApi: EventApiService) {}

  id: string;
  event: EventModel;
  isLoading: boolean;
  btnText = `${(new Money(0)).toYuan()} 购买门票`;
  isPaymentPopup = false;
  isNewPayment = false;
  private _ticketCount = 1;
  isTicketCountError = false;
  amount = new Money(0);
  isAmoutLoading = false;
  isContinuePopup = false;
  debounceTimer: any;
  oldTicket = null;
  isGotoWechatPopup = false;
  qrcode: string;

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.initData();
  }

  get ticketCount(): number {
    return this._ticketCount;
  }

  set ticketCount(count: number) {
    this._ticketCount = count;
    this.checkAmount(count);
  }

  checkAmount(count: number) {
    if (Number.isInteger(count) && count > 0) {
      this.isTicketCountError = false;
    } else {
      this.isTicketCountError = true;
      return;
    }

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.isAmoutLoading = true;

      this.eventApi.getEventData(this.id).then(() => {

      }).finally(() => {
        this.isAmoutLoading = false;
      })
    }, 500);
  }

  initData() {
    this.isLoading = true;
    this.eventApi.getEventData(this.id).then(event => {
      this.event = event;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  clearOldTicket() {

  }

  buy() {
    if (UtilsService.isInWechat && !UtilsService.isWindowsWechat) {
      if (this.oldTicket) {
        this.popupContinue();
      } else {
        this.popupPayment(true);
      }
    } else {
      this.popupPayment(true);
      // this.popupGotoWechat();
    }
  }

  popupPayment(isNewPayment) {
    this.isNewPayment = isNewPayment;
    this.isPaymentPopup = true;
  }

  popupContinue() {
    this.isContinuePopup = true;
  }

  popupGotoWechat() {
    System.import('yaqrcode').then(yaqrcode => {
      this.qrcode = yaqrcode(location.href, {size: 240});
      this.isGotoWechatPopup = true;
    });
  }
}
