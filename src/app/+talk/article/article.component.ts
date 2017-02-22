import {Component, OnInit} from '@angular/core';
import {TalkService} from "../../shared/api/talk/talk.api";
import {ActivatedRoute} from "@angular/router";
import {TalkInfoModel} from "../../shared/api/talk/talk.model";

@Component({
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})

export class ArticleComponent implements OnInit {
  id: string;
  talkInfo: TalkInfoModel;
  isLoading: boolean;

  constructor(private route: ActivatedRoute, private talkApiService: TalkService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.isLoading = true;
    this.talkApiService.getTalkInfo(this.id).then(talkInfo => {
      this.talkInfo = talkInfo;
    }).finally(() => {
      this.isLoading = false;
    });
  }
}
