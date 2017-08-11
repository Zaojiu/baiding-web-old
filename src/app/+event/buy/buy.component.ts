import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {EventApiService} from "../../shared/api/event/ticket.api";
import {EventModel} from "../../shared/api/event/ticket.model";
import {Money, UtilsService} from "../../shared/utils/utils";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";

@Component({
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss'],
})

export class BuyComponent implements OnInit {
  id: string;
  event: EventModel;
  isLoading: boolean;
  btnText = '购买门票';
  isPaymentPopup = false;
  private _ticketCount: number;
  isTicketCountError = false;
  amount = new Money(0);
  isAmoutLoading = false;
  debounceTimer: any;

  constructor(private router: Router, private route: ActivatedRoute,
              private eventApi: EventApiService, private tips: OperationTipsService) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.initData();
    this.ticketCount = 1;
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

      this.eventApi.fee(this.id, this.ticketCount).then(fee => {
        this.amount = new Money(fee.totalFee);
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

  handlePaymentReuslt(result: string) {
    if (result === '') {
      this.tips.popup('支付成功');
      this.router.navigate(['/my/tickets']);
    } else if (result === 'weixin_js_bridge_not_found') {
      this.tips.popup('微信支付初始化失败，请刷新页面重试');
    } else if (result === 'timeout') {
      this.tips.popup('支付超时，请重新支付');
    }
  }

  pay() {
    if (UtilsService.isInWechat && !UtilsService.isWindowsWechat) {
      this.eventApi.wechatPay(this.id, this.ticketCount).then(result => {
        this.handlePaymentReuslt(result);
      });
    } else {
      this.eventApi.pcPay(this.id, this.ticketCount).then(result => {
        this.handlePaymentReuslt(result);
      });
    }
  }
}
