import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import isUndefined = require("lodash/isUndefined");

@Component({
  moduleId: module.id,
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
})

export class ImageViewerComponent implements OnChanges {
  @Input() imageFiles: File[];
  @Input() imageLinks: string;
  imageSrc = '';
  isPopup: boolean;


  constructor() {
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
  }

  deleteImageSource() {
    this.imageSrc = '';
    this.imageFiles = [];
  }
}
