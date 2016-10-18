import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router} from '@angular/router';

import {CommentModel} from '../../shared/api/comment/comment.model';
import {CommentService} from './comment.service';

@Component({
  selector: 'comments',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})

export class CommentComponent implements OnInit, OnDestroy {
  @Input() streamId: string;

  maxCommentAmount: number = 3;
  comments: CommentModel[] = [];

  constructor(private commentService: CommentService, private router: Router) {
  }

  ngOnInit() {
    this.commentService.startReceive(this.streamId);
    this.commentService.onReceiveComments(comment => {
      this.onReceiveComments(comment)
    });
  }

  ngOnDestroy() {
    this.commentService.stopReceive(this.streamId)
  }

  onReceiveComments(comment: CommentModel) {
    for (let idx in this.comments) {
      if (this.comments[idx].id == comment.id) {
        return
      }
    }

    if (this.comments.length >= this.maxCommentAmount) {
      this.comments.shift();
    }

    this.comments.push(comment);
  }

  gotoCommentList() {
    this.router.navigate([`/lives/${this.streamId}/push-comment`]);
  }
}
