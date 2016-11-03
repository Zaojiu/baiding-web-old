import {Component, OnInit} from '@angular/core';
import {OperationTipsService} from "./operation-tips.service";

@Component({
  selector: 'operation-tips',
  templateUrl: './operation-tips.component.html',
  styleUrls: ['./operation-tips.component.scss']
})

export class OperationTipsComponent implements OnInit {
  content: string;
  isOpened: boolean;

  constructor(private operationTipsService: OperationTipsService) {
  }

  ngOnInit() {
    // app级别组件, 不需销毁。
    this.operationTipsService.popup$.subscribe((tips) => {
      this.content = tips;
      this.isOpened = true;

      setTimeout(() => {
        this.isOpened = false;
      }, 2000);
    });
  }
}
