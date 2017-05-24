import {SafeUrl} from "@angular/platform-browser";

export class ModalContext {
  content: string;
  cancelText: string;
  confirmText: string;
  hasCancelBtn: boolean;
  confirmLink: ModalLink;
  resolver: any;

  constructor(content: string, cancelText: string, confirmText: string, hasCancelBtn: boolean, confirmLink: ModalLink) {
    this.content = content;
    this.cancelText = cancelText;
    this.confirmText = confirmText;
    this.hasCancelBtn = hasCancelBtn;
    this.confirmLink = confirmLink;
  }
}

export class ModalLink {
  link: SafeUrl;
  target: string;

  constructor(link: SafeUrl, target: string) {
    this.link = link;
    this.target = target;
  }
}
