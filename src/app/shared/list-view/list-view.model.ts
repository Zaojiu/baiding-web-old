export class ListViewResult {
  result: ListViewModel[];
  marker: string;
  hasMore: boolean;

  constructor(result: ListViewModel[], marker: string, hasMore: boolean) {
    this.result = result;
    this.marker = marker;
    this.hasMore = hasMore;
  }
}

export class ListViewModel {
  id: string;
  cover: string;
  subject: string;
  desc: string;
  goto: () => void;

  constructor(id: string, cover: string, subject: string, desc: string, goto: () => void) {
    this.id = id;
    this.cover = cover;
    this.subject = subject;
    this.desc = desc;
    this.goto = goto;
  }
}
