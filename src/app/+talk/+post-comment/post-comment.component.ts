import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {TalkService} from "../../shared/api/talk/talk.api";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";

@Component({
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss'],
})

export class TalkPostCommentComponent implements OnInit {
  id: string;
  subject: string;
  replyId: string;
  replyNick: string;
  replyContent: string;
  isSubmitting: boolean;
  form: FormGroup;
  content: string;


  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
              private talkApiService: TalkService, private tipsService: OperationTipsService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.subject = this.route.snapshot.queryParams['title'];
    if (this.subject) this.subject = decodeURIComponent(this.subject);
    let request = this.route.snapshot.queryParams['request'];

    if (request) {
      let requestObj = JSON.parse(decodeURIComponent(request));
      this.replyId = requestObj.id;
      this.replyNick = requestObj.nick;
      this.replyContent = requestObj.content;
    }

    this.form = this.fb.group({
      'content': new FormControl(this.content, [
        Validators.required,
      ]),
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });

    if (this.form.invalid) return;

    this.postComment();
  }

  backToTalk() {
    this.router.navigate([`/talks/${this.id}`]);
  }

  postComment() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    this.talkApiService.postComment(this.id, this.content, this.replyId).then(() => {
      this.tipsService.popup('评论成功');
      this.backToTalk();
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
}
