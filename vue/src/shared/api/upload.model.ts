export class UploadCoverTokenModel {
  coverKey: string;
  token: string;

  constructor(coverKey: string, token: string) {
    this.coverKey = coverKey;
    this.token = token;
  }
}
