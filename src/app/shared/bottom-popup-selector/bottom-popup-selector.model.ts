export class BottomPopupSelectorItemModel {
  id: string;
  content: string;
  enabled: boolean;

  constructor(id: string, content: string, enabled: boolean) {
    this.id = id;
    this.content = content;
    this.enabled = enabled;
  }
}

export class BottomPopupSelectorModel {
  items: BottomPopupSelectorItemModel[];
  hasBottomBar: boolean;
}
