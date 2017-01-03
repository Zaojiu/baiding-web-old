import {Component, Input, Output, EventEmitter} from '@angular/core';
import {UserInfoModel} from "../api/user-info/user-info.model";
import {LiveInfoModel} from "../api/live/live.model";

@Component({
  selector: 'at-keyboard',
  templateUrl: './at-keyboard.component.html',
  styleUrls: ['./at-keyboard.component.scss'],
})

export class AtKeyBoardComponent {
  @Input() liveInfo: LiveInfoModel;
  @Input() inputContent: string;
  @Output() inputContentChange = new EventEmitter<string>();

  constructor() {
  }

  changeInputContent(content: string) {
    this.inputContent = content;
    this.inputContentChange.emit(content);
  }

  atSomeone(editor: UserInfoModel) {
    if (this.inputContent.indexOf(editor.uid.toString()) !== -1) {
      let content = this.inputContent.replace(`@${editor.nick}(${editor.uid}) `, '');
      this.changeInputContent(content);
    } else {
      if (this.inputContent[this.inputContent.length - 1] === '@') {
        this.changeInputContent(`${this.inputContent}${editor.nick}(${editor.uid}) `);
      } else {
        this.changeInputContent(`${this.inputContent}@${editor.nick}(${editor.uid}) `);
      }
    }
  }

  isSelected(uid: number): boolean {
    return this.inputContent.indexOf(uid.toString()) !== -1;
  }
}
