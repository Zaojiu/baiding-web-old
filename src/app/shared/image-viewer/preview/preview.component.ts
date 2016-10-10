import {
  Component, ElementRef, EventEmitter, Output, Input, OnInit, OnDestroy, OnChanges, SimpleChange
} from '@angular/core';
import {ModalService} from "../../modal/modal.service";
import {ImageViewerService} from "../image-viewer.service";
import {Subscription} from 'rxjs/Subscription';
declare var $: any;

@Component({
  selector: 'image-viewer-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],

})

export class PreviewComponent implements OnInit,OnDestroy {
  private el: HTMLElement;
  closeImgSubscription: Subscription;
  deleteImgSubscription: Subscription;
  @Input() imageFiles: File[];
  @Output() imageFilesChange = new EventEmitter<File[]>();
  @Input() imageLinks: String[];
  imageSrc = '';
  isPopup: boolean;

  constructor(el: ElementRef, private modalService: ModalService, private imageViewerService: ImageViewerService) {
    this.el = el.nativeElement
  }

  ngOnInit() {

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
    this.imageViewerService.popup(this.imageLinks, this.imageFiles);

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
