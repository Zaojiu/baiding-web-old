export class ModalContext {
  content: string;
  cancelText: string;
  confirmText: string;
  hasCancelBtn: boolean;
  resolver: any;

  constructor(content: string, cancelText: string, confirmText: string, hasCancelBtn: boolean) {
    this.content = content;
    this.cancelText = cancelText;
    this.confirmText = confirmText;
    this.hasCancelBtn = hasCancelBtn;
  }
}
