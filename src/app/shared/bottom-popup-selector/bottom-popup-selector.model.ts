export class BottomPopupSelectorItemModel {
  id: string;
  content: string;
  enable: boolean;

  constructor(id: string, content: string, enable: boolean) {
    this.id = id;
    this.content = content;
    this.enable = enable;
  }
}

export class BottomPopupSelectorModel {
  items: BottomPopupSelectorItemModel[];
  hasBottomBar: boolean;
}
