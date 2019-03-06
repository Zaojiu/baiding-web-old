export class SpeakerModel {
  id: string;
  uid: number;
  subject: string;
  title: string;
  coverUrl: string;
  desc: string;

  constructor(speakerData: any) {
    this.id = speakerData ? speakerData.id : '';
    this.uid = speakerData ? speakerData.uid : '';
    this.subject = speakerData ? speakerData.subject : '';
    this.title = speakerData ? speakerData.desc||speakerData.title : ''; // 目前的desc是title。。。等待后端修改
    // this.coverUrl = speakerData && speakerData.coverUrl ? encodeURI(speakerData.coverUrl)+'~1-1' : '/assets/img/default-cover.jpg';
    this.coverUrl = speakerData && speakerData.coverUrl;
    // this.desc = speakerData ? speakerData.desc : '';
  }
}
