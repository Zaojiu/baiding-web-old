export class BottomPopupSelectorItemModel {
  id: number;
  content: string;
  enable: boolean;

  constructor(id: number, content: string, enable: boolean) {
    this.id = id;
    this.content = content;
    this.enable = enable;
  }
}

export class BottomPopupSelectorModel {
  items: BottomPopupSelectorItemModel[];
  hasBottomBar: boolean;
}
