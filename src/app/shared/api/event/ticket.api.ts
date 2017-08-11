import {Injectable}     from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {host} from "../../../../../vue/src/env/environment";
import {EventModel} from "./ticket.model";

@Injectable()
export class EventApiService {
  constructor(private http: Http) {
  }

  getEventData(id: string): Promise<EventModel> {
    const url = `${host.assets}/assets/mock-data/ticket.json`;
    return this.http.get(url).toPromise().then(res => {
      const data = res.json();
      const eventsData = data.result;
      const speakerData = data.include && data.include.speakers;
      if (eventsData && eventsData.length) {
        for (let eventData of eventsData) {
          if (eventData.id === id) return new EventModel(eventData, speakerData);
        }
      }
      return null;
    });
  }
}
