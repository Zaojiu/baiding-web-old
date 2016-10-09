import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {ImgPopupModel} from './image-viewer.model';

@Injectable()
export class ImageViewerService {
  private imagePopupSource = new Subject<ImgPopupModel>();
  imagePopup$ = this.imagePopupSource.asObservable();

  popup(links: String[], images: File[]) {
    let imagePopupModel = new ImgPopupModel(links,images);
    this.imagePopupSource.next(imagePopupModel);
  }
}
