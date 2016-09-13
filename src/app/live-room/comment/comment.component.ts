import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { CommentModel } from './comment.model';
import { CommentService } from './comment.service';

@Component({
  selector: 'comments',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})

export class CommentComponent implements OnInit, OnDestroy {
  @Input() streamId: string;

  maxCommentAmount: number = 3;
  comments: CommentModel[] = [];

  constructor(private commentService: CommentService) { }

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
    if (this.comments.length >= this.maxCommentAmount) {
      this.comments.shift();
    }

    this.comments.push(comment);
  }
}
