import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {PostService} from './post.service';
import {AdditionalContentModel} from './post.model'
import {MessageApiService} from "../../shared/api/message/message.api";
import {CommentApiService} from "../../shared/api/comment/comment.service";

@Component({
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [PostService, CommentApiService]
})

export class PostComponent implements OnInit {
  id: string;
  content = '';
  messageId: string;
  commentId: string;
  additionalContent: AdditionalContentModel;
  isSubmited: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private messageApiService: MessageApiService, private postService: PostService) {
  }

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
    this.messageId = this.route.snapshot.params['message_id'];
    this.commentId = this.route.snapshot.params['comment_id'];

    if (this.messageId) {
      this.postService.getMessage(this.id, this.messageId).then(additionalContent => {
        this.additionalContent = additionalContent
      })
    }

    if (this.commentId) {
      this.postService.getComment(this.id, this.commentId).then(additionalContent => {
        this.additionalContent = additionalContent
      })
    }
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.id])
  }

  backToPushComment() {
    this.router.navigate([`/lives/${this.id}/push-comment`]);
  }

  submit() {
    /*判断是否存在回复和推送动作*/
    if (this.commentId) {

      this.messageApiService.postNiceMessage(this.id, this.content, this.commentId,
        this.additionalContent.user, this.additionalContent.content);
      this.isSubmited = true;
      this.backToMainScreen();

    } else if (this.messageId && this.content !== '') {

      this.messageApiService.postTextMessage(this.id, this.content, this.messageId);
      this.isSubmited = true;
      this.backToMainScreen();

    }
  }

  canDeactivate() {
    return this.isSubmited || (this.content === '');
  }
}
