export class ToolTipsModel {
  id: string;
  content: string;
  enable: boolean;

  constructor(id: string, content: string, enable:boolean) {
    this.id = id;
    this.content = content;
    this.enable = enable;
  }
}
