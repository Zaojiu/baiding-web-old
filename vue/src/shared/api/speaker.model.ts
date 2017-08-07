export class Speaker {
  id: string;
  uid: number;
  subject: string;
  desc: string;
  coverUrl: string;

  constructor(id: string, uid: number, subject: string, desc: string, coverUrl: string) {
    this.id = id;
    this.uid = uid;
    this.subject = subject;
    this.desc = desc;
  }
}
