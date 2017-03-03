import {Component, OnInit}      from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {environment} from "../../../environments/environment";

@Component({
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})

export class ShareComponent implements OnInit {
  liveId: string;
  messageId: string;
  imageUrl: SafeResourceUrl;
  isLoading = true;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    this.messageId = this.route.snapshot.params['message_id'];
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.config.host.io}/api/live/streams/${this.liveId}/messages/${this.messageId}/dessert.jpg`);
  }
}
