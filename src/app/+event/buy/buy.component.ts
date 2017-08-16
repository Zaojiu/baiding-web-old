import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {EventApiService} from "../../shared/api/event/event.api";
import {EventModel} from "../../shared/api/event/event.model";
import {Money, UtilsService} from "../../shared/utils/utils";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {TicketModel} from "../../shared/api/my/my.model";

@Component({
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss'],
})

export class BuyComponent implements OnInit {
  id: string;
  event: EventModel;
  isLoading: boolean;
  btnText = '购买门票';
  isPaymentDisabled = false;
  isPaymentPopup = false;
  private _ticketCount: number;
  isTicketCountError = false;
  amount = new Money(0);
  isAmoutLoading = false;
  debounceTimer: any;
  ticketSelected = null;
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
    setTimeout(() => {
      this.checkTicketCount();
      this.checkAmount(count);
    });
  }

  checkTicketCount() {
    if (this.ticketCount > this.ticketSelected.leftTotal) {
      this.ticketCount = this.ticketSelected.leftTotal;
    }
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

      this.eventApi.fee(this.id, this.ticketCount, this.ticketSelected.id).then(fee => {
        this.amount = new Money(fee.totalFee);
      }).finally(() => {
        this.isAmoutLoading = false;
      })
    }, 500);
  }

  checkDate(event: EventModel, timer?: any) {
    if (moment().isBefore(event.meta.startAtParsed)) {
      this.isPaymentDisabled = true;
      this.btnText = '未开始售票';
    } else {
      this.isPaymentDisabled = false;
      this.btnText = '购买门票';
    }

    if (moment().isAfter(event.meta.endAtParsed)) {
      this.isPaymentDisabled = true;
      this.btnText = '已结束售票';
      this.isPaymentPopup = false;
      clearInterval(timer);
    }
  }

  initData() {
    this.isLoading = true;
    this.eventApi.getEventData(this.id).then(event => {
      this.event = event;

      if (event.meta.tickets.length) {
        this.ticketSelected = event.meta.tickets[0];
        this.ticketCount = 1;

        this.checkDate(event);
        const timer = setInterval(() => {
          this.checkDate(event, timer);
        }, 3000);
      }
    }).finally(() => {
      this.isLoading = false;
    });
  }

  handlePaymentReuslt(result: string) {
    switch (result) {
      case '':
        this.tips.popup('支付成功');
        this.router.navigate(['/my/tickets']);
        break;
      case 'weixin_js_bridge_not_found':
        this.isPaymentPopup = false;
        this.isPayResultShow = true;
        this.payResult = '微信支付初始化失败，请刷新页面重试';
        break;
      case 'timeout':
        this.isPaymentPopup = false;
        this.isPayResultShow = true;
        this.payResult = '支付超时，请重新支付';
        break;
      case 'closed':
        this.isPaymentPopup = false;
        this.isPayResultShow = true;
        this.payResult = '订单已关闭，请重新购买';
        break;
      case 'other error':
        this.isPaymentPopup = false;
        this.isPayResultShow = true;
        this.payResult = '下单失败，请联系我们';
        break;
    }
  }

  pay() {
    this.isPaying = true;

    if (UtilsService.isInWechat && !UtilsService.isWindowsWechat) {
      this.eventApi.wechatPay(this.id, this.ticketCount, this.ticketSelected.id).then(result => {
        this.handlePaymentReuslt(result);
      }, err => {
        this.handlePaymentReuslt(err);
      }).finally(() => {
        this.isPaying = false;
      });
    } else {
      this.eventApi.pcPay(this.id, this.ticketCount, this.ticketSelected.id).then(result => {
        this.handlePaymentReuslt(result);
      }, err => {
        this.handlePaymentReuslt(err);
      }).finally(() => {
        this.isPaying = false;
      });
    }
  }

  chooseTicket(ticket: TicketModel) {
    this.ticketSelected = ticket;
    this.checkTicketCount();
    this.checkAmount(this.ticketCount);
  }
}
