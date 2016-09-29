import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppConfig } from '../../app.config';

@Component({
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})

export class ShareComponent implements OnInit {
  ioUrlPrefix: string;
  liveId: string;
  messageId: string;
  imageUrl: SafeResourceUrl;
  isLoading = true;

  constructor(private route: ActivatedRoute, private appConfig: AppConfig, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.ioUrlPrefix = this.appConfig.urlPrefix.io;
    this.liveId = this.route.parent.snapshot.params['id'];
    this.messageId = this.route.snapshot.params['message_id'];
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.ioUrlPrefix}/api/live/streams/${this.liveId}/messages/${this.messageId}/dessert.jpg`);
 }
}
