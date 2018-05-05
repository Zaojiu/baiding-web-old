export class QiNiuTokenModel {
  key: string;
  token: string;

  constructor(data: any) {
    this.key = data.key;
    this.token = data.token;
  }
}


interface FileReaderEventTarget extends EventTarget {
  result: string;
}

export interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage(): string;
}
