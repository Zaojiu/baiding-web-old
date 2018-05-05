import {EventModel} from "./event.model";
import {host} from "../../env/environment";
import {get} from "./xhr";

export const getEventDetail = async (id: string): Promise<EventModel> => {
  const url = `${host.io}/api/live/events/${id}`;
  const resp = await get(url);
  const data = resp.data;
  return new EventModel(data);
};

export const getEventList = async (): Promise<EventModel []> => {
  const url = `${host.io}/api/live/events?marker`;
  const resp = await get(url);
  const data = resp.data;
  const result = data.result;
  let events: EventModel [] = [];

  if (result) {
    events = result.map( (i: any) => {
      return new EventModel(i);
    });
  }

  return events;
}
