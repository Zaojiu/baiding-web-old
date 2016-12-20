import {Component, ElementRef, OnInit} from '@angular/core';
import {ModalService} from '../modal/modal.service';
import {ImgEvent} from './image-viewer.model';
import {ImageViewerService} from './image-viewer.service';
import {Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {Location} from "@angular/common";

declare var $: any;

@Component({
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})

export class ImageViewerComponent implements OnInit {
  private el: HTMLElement;
  imageSrc = '';
  isPopup: boolean;
  imgEvent: ImgEvent;
  isLoading: boolean;
  canDelete: boolean;
  query: string;

  constructor(el: ElementRef, private modalService: ModalService, private imageViewerService: ImageViewerService, private router: Router, private location: Location) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.imageViewerService.imagePopup$.subscribe((model) => {
      if (!model.images && !model.links) return;

      let urlTree = this.router.parseUrl(this.router.url);
      urlTree.queryParams['showImage'] = 'true';
      this.router.navigateByUrl(urlTree);

      this.isPopup = true;
      this.isLoading = true;
      this.canDelete = model.canDelete;

      if (model.images && model.images.length) {
        let imagesFile = model.images[0];
        let reader = new FileReader();

        reader.onload = (e) => {
          this.imageSrc = e.target['result'];
        };

        reader.readAsDataURL(imagesFile);
      }

      if (model.links && model.links.length) {
        let link = model.links[0].smallLink.toString();
        this.imageSrc = link;
      }

      if (model.weixinLocalIds && model.weixinLocalIds.length) {
        this.imageSrc = model.weixinLocalIds[0];
      }

      this.imgEvent = new ImgEvent();
    });

    let pinchWrapper = new Hammer($(this.el).find('.image-viewer-popup')[0], {});
    pinchWrapper.get('pinch').set({enable: true});
    pinchWrapper.get('doubletap').set({enable: true});
  }

  closePopup() {
    this.imageSrc = '';
    this.isPopup = false;
    this.imageViewerService.close();
  }

  imageLoaded() {
    this.isLoading = false;
    this.imageFitScreen();
  }

  imageFitScreen() {
    let $image = $(this.el).find('.popup-pinch-img');
    let screenWidth = $image.parent().width();
    let screenHeight = $image.parent().height();
    let imgNaturalWidth = $image[0].naturalWidth;
    let imgNaturalHeight = $image[0].naturalHeight;

    /*initial it's position in center*/
    $image.css({'top': '50%', 'left': '50%'});

    if (!(imgNaturalWidth < screenWidth && imgNaturalHeight < screenHeight)) {
      let screenRatio = screenWidth / screenHeight;
      let imgRatio = imgNaturalWidth / imgNaturalHeight;

      if (imgRatio >= screenRatio) {
        $image.css({'width': `${screenWidth}px`, 'height': 'auto'});
      } else {
        $image.css({'width': 'auto', 'height': `${screenHeight}px`});
      }
    } else {
      $image.css({'width': `${imgNaturalWidth}px`, 'height': 'auto'});
      $image.css({'width': 'auto', 'height': `${imgNaturalHeight}px`});
    }
    this.imgEvent.fixWidth = $image.width();
    this.imgEvent.fixHeight = $image.height();
  }

  deleteImageSource() {
    this.modalService.popup('确认删除吗?', '取消', '删除').then((isDelete) => {
      if (isDelete) {
        this.imageSrc = '';
        this.imageViewerService.delete();
        this.isPopup = false;
      }
    });
  }

  pinch(e: HammerInput) {
    let $target = $(e.target);
    let $image = $target.hasClass('popup-pinch-img') ? $target : $target.find('.popup-pinch-img');
    if (!this.imgEvent.isScaling) this.imgEvent.startScale($image.width(), $image.height());

    $image.width(this.imgEvent.originWidth * e.scale);
    $image.height(this.imgEvent.originHeight * e.scale);
  }

  pinchEnd(e: HammerInput) {
    let $target = $(e.target);
    let $image = $target.hasClass('popup-pinch-img') ? $target : $target.find('.popup-pinch-img');
    if (this.imgEvent.isScaling) this.imgEvent.stopScale($image.width(), $image.height());
  }

  pan(e: HammerInput) {
    let $target = $(e.target);
    let $image = $target.hasClass('popup-pinch-img') ? $target : $target.find('.popup-pinch-img');
    $image.css({
      'left': `calc(50% + ${this.imgEvent.originX + e.deltaX}px)`,
      'top': `calc(50% + ${this.imgEvent.originY + e.deltaY}px)`
    });
  }

  panEnd(e: HammerInput) {
    this.imgEvent.setOffSet(e.deltaX, e.deltaY);
  }

  dbltap() {
    let $image = $(this.el).find('.popup-pinch-img');
    let imgNaturalWidth = $image[0].naturalWidth;
    let imgNaturalHeight = $image[0].naturalHeight;
    if (this.imgEvent.fixWidth || this.imgEvent.fixHeight) {
      $image.css({'width': `${imgNaturalWidth}px`, 'height': `${imgNaturalHeight}px`});
      this.imgEvent.fixWidth = 0;
      this.imgEvent.fixHeight = 0;
    } else {
      this.imageFitScreen();
    }
  }
}
