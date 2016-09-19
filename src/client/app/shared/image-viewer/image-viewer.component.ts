import { Component, Input, OnChanges, SimpleChange} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
})

export class  ImageViewerComponent implements OnChanges {
  @Input() imageFile: File;
  @Input() imageLink: string;
  imageSrc: string;


  constructor() {}

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    let fileChange = changes['imageFile'];
    let linkChange = changes['imageLink'];

    if (fileChange && fileChange.currentValue) {
      let reader = new FileReader();
      reader.onload = (e) => {
        console.log(e);
        this.imageSrc = e.target['result'];
      }
      reader.readAsDataURL(fileChange.currentValue)
    }

    if (linkChange && linkChange.currentValue) {
      this.imageSrc = linkChange.currentValue;
    }
  }


}
