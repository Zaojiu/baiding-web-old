import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {ImgPopupModel} from './image-viewer.model';

@Injectable()
export class ImageViewerService {
  private imagePopupSource = new Subject<ImgPopupModel>();
  private imageDeleteSource = new Subject<string>();
  private imageCloseSource = new Subject<string>();
  imagePopup$ = this.imagePopupSource.asObservable();
  imageDelete$ = this.imageDeleteSource.asObservable();
  imageClose$ = this.imageCloseSource.asObservable();

  popup(links: String[], images: File[]) {
    let imagePopupModel = new ImgPopupModel(links,images);
    this.imagePopupSource.next(imagePopupModel);
  }

  delete() {
    this.imageDeleteSource.next('');
  }

  close(){
   this.imageCloseSource.next('');
  }
}
