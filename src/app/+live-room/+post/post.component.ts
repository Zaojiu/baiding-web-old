import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {PostService} from './post.service';
import {AdditionalContentModel} from './post.model'
import {MessageApiService} from "../../shared/api/message/message.api";
import {LiveRoomService} from "../live-room.service";

import {InputtingService} from "../timeline/message/inputting.service";
import {UtilsService} from "../../shared/utils/utils";

@Component({
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})

export class PostComponent implements OnInit {
  id: string;
  content = '';
  commentId: string;
  additionalContent: AdditionalContentModel;
  isSubmited: boolean = false;
  @ViewChild('postCommentContent') postCommentContent: ElementRef;
  isInApp = UtilsService.isInApp;

  constructor(private route: ActivatedRoute, private router: Router, private inputtingService: InputtingService,
              private messageApiService: MessageApiService, private postService: PostService,
              private liveRoomService: LiveRoomService) {
  }

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
    this.commentId = this.route.snapshot.params['comment_id'];

    this.content = this.liveRoomService.getPushCommentStashed(this.commentId);

    if (this.commentId) {
      this.postService.getComment(this.id, this.commentId).then(additionalContent => {
        this.additionalContent = additionalContent
      })
    }

    $(this.postCommentContent.nativeElement).on('input', () => {
      this.liveRoomService.setPushCommentStashed(this.content, this.commentId);
    });
  }

  avatarClicked() {
    this.liveRoomService.setPushCommentStashed(this.content, this.commentId);
  }

  backToMainScreen() {
    this.router.navigate([`lives/${this.id}`])
  }

  backToPushComment() {
    this.router.navigate([`lives/${this.id}/push-comment`]);
  }

  submit() {
    /*判断是否存在回复和推送动作*/
    if (this.commentId) {

      this.messageApiService.postNiceMessage(this.id, this.content, this.commentId,
        this.additionalContent.user, this.additionalContent.content);
      this.isSubmited = true;
      this.backToMainScreen();

    }
  }

  oninputting() {
    this.inputtingService.collect({liveId: this.id, type: 'text'});
  }

  canDeactivate() {
    return this.isSubmited || (this.content === '');
  }
}
