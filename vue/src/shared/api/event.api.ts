import {EventModel} from "./event.model";
import {host} from "../../env/environment";
import {get} from "./xhr";

export const getEvent = async (id: string): Promise<EventModel> => {
  const url = `${host.io}/api/live/events/${id}`;
  const resp = await get(url);
  const data = resp.data;
  return new EventModel(data);
};
