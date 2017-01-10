import {
  Component, ElementRef, EventEmitter, Output, Input, OnDestroy, SimpleChange
} from '@angular/core';
import {ImageViewerService} from "../image-viewer.service";
import {Subscription} from 'rxjs/Subscription';
import {ImageMessageModel} from "../../api/message/message.model";
import {SafeUrl, DomSanitizer} from "@angular/platform-browser";
declare var $: any;

@Component({
  selector: 'image-viewer-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],

})

export class PreviewComponent implements OnDestroy {
  private el: HTMLElement;
  closeImgSubscription: Subscription;
  deleteImgSubscription: Subscription;
  @Input() imageFiles: File[];
  @Output() imageFilesChange = new EventEmitter<File[]>();
  @Input() imageLinks: ImageMessageModel[];
  @Input() weixinLocalIds: string[];
  @Input() canDelete = false;
  imageSrc: SafeUrl;
  isPopup: boolean;

  constructor(el: ElementRef, private imageViewerService: ImageViewerService, private sanitizer: DomSanitizer) {
    this.el = el.nativeElement;
    this.imageSrc = this.sanitizer.bypassSecurityTrustUrl('');
  }

  unsubcribe() {
    if (this.closeImgSubscription) this.closeImgSubscription.unsubscribe();
    if (this.deleteImgSubscription) this.deleteImgSubscription.unsubscribe();
  }

  ngOnDestroy() {
    this.unsubcribe();
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    let fileChange = changes['imageFiles'];
    let linkChange = changes['imageLinks'];
    let weixinIdChange = changes['weixinLocalIds'];

    if (fileChange && fileChange.currentValue && fileChange.currentValue.length) {
      let file = fileChange.currentValue[0];
      let reader = new FileReader();

      reader.onload = (e) => {
        this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(e.target['result']);
      };

      reader.readAsDataURL(file);
    }

    if (linkChange && linkChange.currentValue && linkChange.currentValue.length) {
      let link = linkChange.currentValue[0];
      this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(link.thumbLink);
    }

    if (weixinIdChange && weixinIdChange.currentValue && weixinIdChange.currentValue.length) {
      let localId = weixinIdChange.currentValue[0];
      this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(localId);
    }
  }

  imagePopup() {
    this.imageViewerService.popup(this.imageLinks, this.imageFiles, this.weixinLocalIds, this.canDelete);

    this.closeImgSubscription = this.imageViewerService.imageClose$.subscribe(() => {
      this.unsubcribe();
    });

    this.deleteImgSubscription = this.imageViewerService.imageDelete$.subscribe(() => {
      this.imageFilesChange.emit([]);
      this.unsubcribe();
    });

    this.isPopup = true;
  }
}
