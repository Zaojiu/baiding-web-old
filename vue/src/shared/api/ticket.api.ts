import {TicketModel} from "./ticket.model";
import {host} from "../../env/environment";
import {get} from "./xhr";
import {params} from "../utils/utils";

export const tickets = async (marker?: string): Promise<{tickets: TicketModel[], marker: string}> => {
  const url = `${host.io}/api/live/my/events/tickets`;
  // const url = `http://www.zaojiu.fm/assets/tickets.json`;
  const query = {marker};
  const resp = await get(`${url}?${params(query)}`);
  const data = resp.data;
  const result = data.result || [];

  const tickets = [];
  for (let item of result) {
    let model = new TicketModel(item);
    tickets.push(model);
  }

  const _marker = data.includes && data.includes.marker || '';

  return {tickets: tickets, marker: _marker};
};
