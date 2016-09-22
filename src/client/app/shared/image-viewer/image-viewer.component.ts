import { Component, ElementRef, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { ModalService } from "../modal/modal.service";
import { ScaleEvent } from "./image-viewer.model";

import * as Hammer from 'hammerjs'
declare var $: any

@Component({
  moduleId: module.id,
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
})

export class ImageViewerComponent implements OnInit, OnChanges {
  private el: HTMLElement;
  @Input() imageFiles: File[];
  @Input() imageLinks: string;
  imageSrc = '';
  isPopup: boolean;
  scaleEvent: ScaleEvent;

  constructor(el: ElementRef, private modalService: ModalService) {
    this.el = el.nativeElement
  }

  ngOnInit() {
    let pinchWrapper = new Hammer($(this.el).find('.image-viewer-popup')[0], {domEvents: true});
    pinchWrapper.get('pinch').set({enable: true});
    pinchWrapper.get('pan').set({enable: true});
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
    this.modalService.popup('确认删除吗?', '取消', '删除').then((isDelete) => {
      if (isDelete) {
        console.log(isDelete)
        this.imageSrc = '';
        this.imageFiles = [];
        this.isPopup = false;
      }
    })
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

  pan(e: HammerInput) {
    let $target = $(e.target);
    let $image = $target.hasClass('popup-pinch-img') ? $target : $target.find('.popup-pinch-img');
    $image.css({
      'left': `calc(50% + ${this.scaleEvent.originX + e.deltaX}px)`,
      'top': `calc(50% + ${this.scaleEvent.originY + e.deltaY}px)`
    });
  }

  panEnd(e: HammerInput) {
    this.scaleEvent.setOffSet(e.deltaX, e.deltaY);
  }

  dblclick() {
    let $image = $(this.el).find('.popup-pinch-img');
    let imgWidth = $image[0].naturalWidth;
    let imgHeight = $image[0].naturalHeight;

    $image.css({'width': `${imgWidth}px`, 'height': `${imgHeight}`});

  }
}
