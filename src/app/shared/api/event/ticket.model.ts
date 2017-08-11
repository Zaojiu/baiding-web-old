class SpeakerModel {
  id: string;
  uid: number;
  name: string;
  title: string;
  coverUrl: string;
  desc: string;

  constructor(speakerData: any) {
    this.id = speakerData ? speakerData.id : '';
    this.uid = speakerData ? speakerData.uid : '';
    this.name = speakerData ? speakerData.name : '';
    this.title = speakerData ? speakerData.title : '';
    this.coverUrl = speakerData ? speakerData.coverUrl : '';
    this.desc = speakerData ? speakerData.desc : '';
  }
}

class EventMetaModel {
  startAt: string;
  startAtParsed: Moment;
  endAt: string;
  endAtParsed: Moment;
  province: string;
  city: string;
  address: string;
  location: number[];
  speakers: SpeakerModel[];

  constructor(eventMetaData: any, speakersData: any) {
    this.startAt = eventMetaData ? eventMetaData.startAt : '';
    this.startAtParsed = eventMetaData ? moment(eventMetaData.startAt) : moment();
    this.endAt = eventMetaData ? eventMetaData.endAt : '';
    this.endAtParsed = eventMetaData ? moment(eventMetaData.endAt) : moment();
    this.province = eventMetaData ? eventMetaData.province : '';
    this.city = eventMetaData ? eventMetaData.city : '';
    this.address = eventMetaData ? eventMetaData.address : '';
    this.location = eventMetaData ? eventMetaData.location : '';
    const speakers: SpeakerModel[] = [];
    const speakersId = eventMetaData ? eventMetaData.speakersId : [];
    speakersData = speakersData || [];
    speakersId.forEach(speakerId => {
      speakersData.forEach(speaker => {
        if (speaker.id === speakerId) speakers.push(new SpeakerModel(speaker));
      });
    });
    this.speakers = speakers;
  }
}

export class EventModel {
  id: string;
  subject: string;
  desc: string;
  coverUrl: string;
  meta: EventMetaModel;

  constructor(eventData: any, speakersData: any) {
    this.id = eventData ? eventData.id : '';
    this.subject = eventData ? eventData.subject : '';
    this.desc = eventData ? eventData.desc : '';
    this.coverUrl = eventData ? eventData.coverUrl : '';
    this.meta = eventData ? new EventMetaModel(eventData.meta, speakersData) : null;
  }
}
