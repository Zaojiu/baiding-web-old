import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveService } from '../../shared/live/live.service';
import { PostDanmuService } from '../../shared/comment/post-danmu.service';
import { PostService } from './post.service';
import { AdditionalContentModel } from './post.model'
import { MessageApiService } from "../../shared/api/message.api";

@Component({
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [ PostDanmuService, PostService ]
})

export class PostComponent implements OnInit {
  id: string;
  content = '';
  messageId: string;
  danmuId: string;
  additionalContent: AdditionalContentModel;

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService,
    private postDanmuService: PostDanmuService, private messageApiService: MessageApiService,
    private liveRoomPostCommmentService: PostService) {}

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
    this.messageId = this.route.snapshot.params['message_id'];
    this.danmuId = this.route.snapshot.params['danmu_id'];

    if (this.messageId) {
      this.liveRoomPostCommmentService.getMessage(this.id, this.messageId).then(additionalContent => {
        this.additionalContent = additionalContent
      })
    }

    if (this.danmuId) {
      this.liveRoomPostCommmentService.getDanmu(this.id, this.danmuId).then(additionalContent => {
        this.additionalContent = additionalContent
      })
    }
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.id]);
  }

  backToPushDanmu() {
    this.router.navigate([`/lives/${this.id}/push-danmu`]);
  }

  isEditor() { return this.liveService.isEditor(this.id); }

  isAudience() { return this.liveService.isAudience(this.id); }

  submit() {
    if (this.messageId) return this.postMessage()

    if (this.danmuId) return this.pushDanmu()

    if (this.isEditor()) return this.postMessage()

    if (!this.isEditor()) return this.postDanmu()
  }

  pushDanmu() {
    if (this.content === '') return

    this.messageApiService.postNiceMessage(this.id, this.content, this.danmuId, this.additionalContent.user.uid, this.additionalContent.content).then(() => this.backToPushDanmu());
  }

  postDanmu() {
    if (this.content === '') return

    this.postDanmuService.postDanmu(this.id, this.content).then(() => this.backToMainScreen());
  }

  postMessage() {
    if (this.content === '') return

    this.messageApiService.postTextMessage(this.id, this.content, this.messageId).then(() => this.backToMainScreen());
  }
}
