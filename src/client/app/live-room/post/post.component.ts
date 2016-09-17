import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveService } from '../../shared/live/live.service';
import { CommentApiService } from '../../shared/api/comment.service';
import { PostService } from './post.service';
import { AdditionalContentModel } from './post.model'
import { MessageApiService } from "../../shared/api/message.api";

@Component({
  moduleId: module.id,
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [ CommentApiService, PostService ]
})

export class PostComponent implements OnInit {
  id: string;
  content = '';
  messageId: string;
  commentId: string;
  additionalContent: AdditionalContentModel;
  isSubmited: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService,
              private commentApiService: CommentApiService, private messageApiService: MessageApiService,
              private postService: PostService) {}

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

  isEditor() { return this.liveService.isEditor(this.id); }

  isAudience() { return this.liveService.isAudience(this.id); }

  submit() {
    if (this.messageId) return this.postMessage()

    if (this.commentId) return this.pushComment()

    if (this.isEditor()) return this.postMessage()

    if (!this.isEditor()) return this.postComment()
  }

  pushComment() {
    if (this.content === '') return

    this.messageApiService.postNiceMessage(this.id, this.content, this.commentId,
      this.additionalContent.user.uid, this.additionalContent.content).then(() => {
      this.isSubmited = true;
      this.backToPushComment()
    });
  }

  postComment() {
    if (this.content === '') return

    this.commentApiService.postComment(this.id, this.content).then(() => {
      this.isSubmited = true;
      this.backToMainScreen()
    });
  }

  postMessage() {
    if (this.content === '') return

    this.messageApiService.postTextMessage(this.id, this.content, this.messageId).then(() => {
      this.isSubmited = true;
      this.backToMainScreen()
    })
  }

  canDeactivate() {
    return this.isSubmited;
  }
}
