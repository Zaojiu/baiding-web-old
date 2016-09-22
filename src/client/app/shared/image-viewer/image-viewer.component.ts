import {Component, ElementRef, Input, OnInit, OnChanges, SimpleChange} from '@angular/core';

import {ScaleEvent} from "./image-viewer.model";

import * as Hammer from 'hammerjs'
declare var $: any

@Component({
  moduleId: module.id,
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
})

export class ImageViewerComponent implements OnInit,OnChanges {
  private el: HTMLElement;
  @Input() imageFiles: File[];
  @Input() imageLinks: string;
  imageSrc = '';
  isPopup: boolean;
  scaleEvent: ScaleEvent;

  constructor(el: ElementRef) {
    this.el = el.nativeElement
  }

  ngOnInit() {
    let pinchWrapper = new Hammer($(this.el).find('.image-viewer-popup')[0], {domEvents: true});
    pinchWrapper.get('pinch').set({enable: true});
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

  imagePopup() {
    this.isPopup = true;
    this.scaleEvent = new ScaleEvent();

    let $image = $(this.el).find('.popup-pinch-img');
    let screenWidth = $image.parent().width();
    let screenHeight = $image.parent().height();
    let imgWidth = $image[0].naturalWidth;
    let imgHeight = $image[0].naturalHeight;

    if (imgWidth < screenWidth && imgHeight < screenHeight) return;

    let screenRatio = screenWidth / screenHeight;
    let imgRatio = imgWidth / imgHeight;

    if (imgRatio >= screenRatio) {
      $image.css({'width': `${screenWidth}px`, 'height': 'auto'});
    } else {
      $image.css({'width': 'auto', 'height': `${screenHeight}px`});
    }
  }

  deleteImageSource() {
    this.imageSrc = '';
    this.imageFiles = [];
  }

  pinch(e: HammerInput) {
    let $target = $(e.target);
    let $image = $target.hasClass('popup-pinch-img') ? $target : $target.find('.popup-pinch-img');
    if (!this.scaleEvent.isScaling) this.scaleEvent.startScale($image.width(), $image.height());

    $image.width(this.scaleEvent.originWidth * e.scale);
    $image.height(this.scaleEvent.originHeight * e.scale);
  }

  pinchEnd(e: HammerInput) {
    let $target = $(e.target);
    let $image = $target.hasClass('popup-pinch-img') ? $target : $target.find('.popup-pinch-img');
    if (this.scaleEvent.isScaling) this.scaleEvent.stopScale($image.width(), $image.height());
  }

  pan(e) {
    console.log(e)
  }
}
