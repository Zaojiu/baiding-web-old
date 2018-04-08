import {
  Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnChanges,
  SimpleChanges, AfterViewInit, OnDestroy
} from '@angular/core';
import {EditMode} from "./comment-input.enums";
import {CommentApiService} from "../api/comment/comment.service";
import {LiveRoomService} from "../../+live-room/live-room.service";
import {LiveInfoModel} from "../api/live/live.model";
import {UserInfoModel} from "../api/user-info/user-info.model";
import {CommentModel} from "../api/comment/comment.model";
import {UserInfoService} from "../api/user-info/user-info.service";
import {Router} from "@angular/router";

declare var $: any;

@Component({
  selector: 'comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss'],
})

export class CommentInputComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() liveId: string;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  @Input() mode: EditMode;
  @Output() modeChange = new EventEmitter<EditMode>();
  @Input() commentContent: string;
  @Output() commentContentChange = new EventEmitter<string>();
  @Output() postSuccessful = new EventEmitter<CommentModel>();
  @ViewChild('commentInput') commentInput: ElementRef;
  isPosting: boolean;
  modeEnums = EditMode;

  constructor(private router: Router, private commentApiService: CommentApiService, private liveRoomService: LiveRoomService) {
  }

  ngAfterViewInit() {
    $(this.commentInput.nativeElement).on('input', () => {
      this.detectContentChange();
      this.liveRoomService.setTextWordsStashed(this.commentContent, this.liveId);
    });
  }

  ngOnDestroy() {
    $(this.commentInput.nativeElement).off('input');
  }

  ngOnChanges(changes: SimpleChanges) {
    let mode = changes['mode'];
    if (mode) {
      let modeParsed = mode.currentValue as EditMode;

      if (modeParsed === EditMode.Text) {
        this.focusMessageInput();
      } else {
        this.blurMessageInput();
      }

      if (modeParsed !== EditMode.Text && modeParsed !== EditMode.At) {
        setTimeout(() => { // use timeout to prevent lifecycle check error
          this.liveRoomService.setTextWordsStashed(this.commentContent, this.liveId);
          this.changeCommentContent('');
        });
      } else if (this.commentContent === '') {
        setTimeout(() => { // use timeout to prevent lifecycle check error
          let contentCache = this.liveRoomService.getTextWordsStashed(this.liveId);
          this.changeCommentContent(contentCache);
        });
      }
    }
  }

  changeCommentContent(content: string) {
    this.commentContent = content;
    this.commentContentChange.emit(content);
  }

  changeMode(mode: EditMode) {
    this.mode = mode;
    this.modeChange.emit(mode);
  }

  parseAtUser(): UserInfoModel[] {
    var atRegexp = /(@.+?)\((.+?)\)/g;
    let atUids: number[] = [];
    let toUsers: UserInfoModel[] = [];

    while (true) {
      var atTextArr = atRegexp.exec(this.commentContent);
      if (!atTextArr || atTextArr.length != 3 || !atRegexp.lastIndex) {
        break;
      }
      atUids.push(+atTextArr[2]);
    }

    for (let uid of atUids) {
      if (uid === this.liveInfo.admin.uid) {
        toUsers.push(this.liveInfo.admin);

      }
    }

    for (let user of this.liveInfo.editors) {
      for (let uid of atUids) {
        if (uid === user.uid) {
          toUsers.push(user);
        }
      }
    }
    return toUsers;
  }

  postComment() {
    if (this.commentContent === '' || this.isPosting) return;

    this.isPosting = true;

    this.commentApiService.postComment(this.liveId, this.commentContent, this.parseAtUser()).then(comment => {
      this.changeCommentContent('');
      this.liveRoomService.setTextWordsStashed('', this.liveId);
      this.postSuccessful.emit(comment);
    }).finally(() => {
      this.isPosting = false;
    });
  }

  detectContentChange() {
    if ($.isNumeric(this.commentContent[this.commentContent.length - 1])) {
      this.changeCommentContent(this.commentContent.replace(/(.*)@[\W\w]+?\(\d+?$/g, '$1'));
    }

    if (this.commentContent[this.commentContent.length - 1] === '@') {
      this.changeMode(EditMode.At);
    }
  }

  focusMessageInput() {
    this.commentInput.nativeElement.focus();
  }

  blurMessageInput() {
    this.commentInput.nativeElement.blur();
  }

  checkLogin () {
    if (!this.userInfo) {
      this.router.navigate(['/signin'], {queryParams: {redirectTo: location.href}});
    }
    return;
  }
}
