import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LiveService} from '../../shared/live/live.service';
import {CommentApiService} from '../../shared/api/comment.service';
import {PostService} from './post.service';
import {AdditionalContentModel} from './post.model'
import {MessageApiService} from "../../shared/api/message.api";

@Component({
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [ CommentApiService, PostService ]
})

export class PostComponent implements OnInit {
  id: string;
  content = '';
  messageId: string;
  commentId: string;
  additionalContent: AdditionalContentModel;
  isSubmited: boolean = false;
  images: File[];
  imageExist: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService,
              private commentApiService: CommentApiService, private messageApiService: MessageApiService,
              private postService: PostService) {
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

  isEditor() {
    return this.liveService.isEditor(this.id);
  }

  isAudience() {
    return this.liveService.isAudience(this.id);
  }

  submit() {
    this.imageExist = this.images && !!this.images.length;

    if (this.content === '' && !this.imageExist) return;

    /*判断是否为嘉宾*/
    if (this.isEditor()) {

      /*判断是否存在回复和推送动作*/
      if (this.commentId) {
        this.pushComment()
      } else if (this.messageId) {
        this.postMessage()
      } else {

        /*进入消息发送分支*/
        if (this.content !== '' && this.imageExist) {
          let p1 = this.postMessage();
          let p2 = this.postImgMessage();
          Promise.all([p1, p2]).then((res)=> {
            this.backToMainScreen();
          })
        } else if (this.content === '' && this.imageExist) {
          this.postImgMessage().then(()=> {
              this.backToMainScreen();
            }
          )
        } else if (this.content !== '' && !this.imageExist) {
          this.postMessage().then(()=> {
              this.backToMainScreen();
            }
          )
        }
      }
    } else {
      /*观众评论*/
      this.postComment();
    }

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

  postMessage(): Promise<any> {
    if (this.content === '') return

    return this.messageApiService.postTextMessage(this.id, this.content, this.messageId).then(() => {
      this.isSubmited = true;
      return
    })
  }

  postImgMessage(): Promise<any> {
    if (!(this.images && this.images.length)) return

    return this.messageApiService.postImgMessage(this.id, this.images[0], this.messageId)
      .then(() => {
        this.isSubmited = true;
        return
      })
  }

  canDeactivate() {
    return this.isSubmited;
  }
}
