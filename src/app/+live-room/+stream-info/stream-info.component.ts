import {Component, OnInit, ViewChild, ElementRef, AfterViewInit}      from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {LiveService} from "../../shared/api/live/live.service";
import {UtilsService} from "../../shared/utils/utils";
import {PushStreamAddr} from "./stream-info.model";

@Component({
  templateUrl: './stream-info.component.html',
  styleUrls: ['./stream-info.component.scss'],
})

export class StreamInfoComponent implements OnInit, AfterViewInit {
  liveId: string;
  pushStreamAddr: PushStreamAddr[];
  pullStreamAddr: {[key: string]: string} = {};
  @ViewChild('copyBtn') copyBtn: ElementRef;
  isInApp = UtilsService.isInApp;

  constructor(private route: ActivatedRoute, private tipsService: OperationTipsService, private liveService: LiveService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.parent.snapshot.params['id'];

    this.liveService.getStreamPushingAddr(this.liveId).then(pushStreamAddr => {
      this.pushStreamAddr = [];

      for (let addr of pushStreamAddr) {
        this.pushStreamAddr.push(new PushStreamAddr(addr));
      }
    });

    this.liveService.getStreamPullingAddr(this.liveId).then(videoInfo => {
      this.pullStreamAddr['m3u8'] = videoInfo.m3u8;
      this.pullStreamAddr['rtmp'] = videoInfo.rtmp;
    });
  }

  ngAfterViewInit() {
    System.import('clipboard').then(clipboard => {
      let copyBtn = new clipboard(this.copyBtn.nativeElement);

      copyBtn.on('success', (e) => {
        e.clearSelection();
        this.tipsService.popup('推流地址复制成功');
      });

      copyBtn.on('error', (e) => {
        this.tipsService.popup('推流地址复制失败, 请手动复制输入框文本');
      });
    });
  }
}
