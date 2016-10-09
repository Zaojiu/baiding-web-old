import {Component, ElementRef, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChange} from '@angular/core';
import { Router } from '@angular/router';
import {ModalService} from "../modal/modal.service";
// import {ImgEvent} from "./image-viewer.model";
import {ImageViewerService} from "../image-viewer/image-viewer.service";
import {ImageViewerComponent} from "../image-viewer/image-viewer.component";

import * as Hammer from 'hammerjs'
declare var $: any

@Component({
  selector: 'image-viewer-preview',
  templateUrl: './image-viewer-preview.component.html',
  styleUrls: ['./image-viewer-preview.component.scss'],

})

export class ImageViewerPreviewComponent implements OnInit, OnChanges {
  private el: HTMLElement;
  @Input() imageFiles: File[];
  @Output() imageFilesChange = new EventEmitter<File[]>();
  @Input() imageLinks: String[];
  imageSrc = '';
  isPopup: boolean;
  // imgEvent: ImgEvent;

  constructor(el: ElementRef, private modalService: ModalService,private router: Router,private imageViewerService: ImageViewerService) {
    this.el = el.nativeElement
  }

 ngOnInit() {
    // let pinchWrapper = new Hammer($(this.el).find('.image-viewer-popup')[0], {});
    // pinchWrapper.get('pinch').set({enable: true});
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    let fileChange = changes['imageFiles'];
    let linkChange = changes['imageLinks'];

    if (fileChange && fileChange.currentValue && fileChange.currentValue.length) {
      let file = fileChange.currentValue[0];
      let reader = new FileReader();

      reader.onload = (e) => {
        this.imageSrc = e.target['result'];
      };

      reader.readAsDataURL(file);
    }

    if (linkChange && linkChange.currentValue && linkChange.currentValue.length) {
      let link = linkChange.currentValue[0];
      this.imageSrc = link;
    }


  }

  closePopup() {
    this.isPopup = false;
  }

  imagePopup() {
    console.log('imagePoppup()')
    this.imageViewerService.popup(this.imageLinks,this.imageFiles);
    this.isPopup = true;
  }

}
