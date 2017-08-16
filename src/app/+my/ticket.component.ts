import {Component, OnInit} from '@angular/core';
import {MyApiService} from "../shared/api/my/my.api";
import {TicketModel} from "../shared/api/my/my.model";

@Component({
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})

export class TicketComponent implements OnInit {
  isLoading: boolean;
  tickets: TicketModel[];
  now = moment();

  constructor(private myService: MyApiService) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.isLoading = true;

    this.myService.tickets().then(tickets => {
      this.tickets = tickets;
    }).finally(() => {
      this.isLoading = false;
    });
  }
}
