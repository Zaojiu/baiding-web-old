export enum BottomPopupSelectorMode{ Single = 0, Multi, }

export class BottomPopupSelectorItemModel {
  id: string;
  content: string;
  enable: boolean;
  mode: BottomPopupSelectorMode;
  checked: boolean;

  constructor(id: string, content: string, enable = true, mode = BottomPopupSelectorMode.Single, checked = false) {
    this.id = id;
    this.content = content;
    this.enable = enable;
    this.mode = mode;
    this.checked = checked;
  }
}

export class BottomPopupSelectorModel {
  items: BottomPopupSelectorItemModel[];
  completeText = '取消';
  needSubscribe = true;
}
