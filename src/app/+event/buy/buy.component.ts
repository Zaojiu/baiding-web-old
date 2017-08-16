import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {EventApiService} from "../../shared/api/event/event.api";
import {EventModel} from "../../shared/api/event/event.model";
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
  ticketId = '';
  isPaying = false;
  isPayResultShow = false;
  payResult = '';

  constructor(private router: Router, private route: ActivatedRoute,
              private eventApi: EventApiService, private tips: OperationTipsService) {}

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

      this.eventApi.fee(this.id, this.ticketCount, this.ticketId).then(fee => {
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
      if (this.event.meta.tickets.length) {
        this.ticketId = this.event.meta.tickets[0].id;
        this.ticketCount = 1;
      }
    }).finally(() => {
      this.isLoading = false;
    });
  }

  handlePaymentReuslt(result: string) {
    this.isPaymentPopup = false;

    if (result === '') {
      this.tips.popup('支付成功');
      this.router.navigate(['/my/tickets']);
    } else if (result === 'weixin_js_bridge_not_found') {
      this.isPayResultShow = true;
      this.payResult = '微信支付初始化失败，请刷新页面重试';
    } else if (result === 'timeout') {
      this.isPayResultShow = true;
      this.payResult = '支付超时，请重新支付';
    } else if (result === 'closed') {
      this.isPayResultShow = true;
      this.payResult = '订单已关闭，请重新购买';
    }
  }

  pay() {
    this.isPaying = true;

    if (UtilsService.isInWechat && !UtilsService.isWindowsWechat) {
      this.eventApi.wechatPay(this.id, this.ticketCount, this.ticketId).then(result => {
        this.handlePaymentReuslt(result);
      }).finally(() => {
        this.isPaying = false;
      });
    } else {
      this.eventApi.pcPay(this.id, this.ticketCount, this.ticketId).then(result => {
        this.handlePaymentReuslt(result);
      }).finally(() => {
        this.isPaying = false;
      });
    }
  }

  chooseTicket(id: string) {
    this.ticketId = id;
    this.checkAmount(this.ticketCount);
  }
}
