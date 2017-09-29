import {EventModel} from "./event.model";

enum TicketStatus {
  Paid = 1,
  Approved,
  Declined,
}

export class TicketModel {
  id: string;
  ticketId: string;
  ticketNo: string;
  status: TicketStatus;
  eventId: string;
  name: string;
  mobile: string;
  event: EventModel;
  signedInAt: string;
  signedInAtParsed: Moment;
  applyAt: string;
  applyAtParsed: Moment;

  constructor(data: any) {
    if (!data) return;

    this.id = data.id;
    this.ticketId = data.ticketId;
    this.ticketNo = data.ticketNo;
    this.status = data.status;
    this.eventId = data.eventId;
    this.name = data.name;
    this.mobile = data.mobile;
    this.event = new EventModel(data.event); // no speaker data
    this.signedInAt = data.signedInAt;
    this.signedInAtParsed = moment(data.signedInAt);
    this.applyAt = data.applyAt;
    this.applyAtParsed = moment(data.applyAt);
  }

  get isUsed(): boolean {
    return !this.signedInAtParsed.isZero();
  }

  get isUnused(): boolean {
    return !this.isUsed;
  }

  get typeHumanize(): string {
    let type = '门票';
    this.event.meta.tickets.forEach(ticket => {
      if (ticket.id === this.ticketId) type = ticket.name;
    });
    return type;
  }
}
