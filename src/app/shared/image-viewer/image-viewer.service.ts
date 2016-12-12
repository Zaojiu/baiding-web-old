import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {ImgPopupModel} from './image-viewer.model';
import {ImageMessageModel} from "../api/message/message.model";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ImageViewerService {
  private imagePopupSource = new Subject<ImgPopupModel>();
  private imageDeleteSource = new Subject<string>();
  private imageCloseSource = new Subject<string>();
  imagePopup$: Observable<ImgPopupModel> = this.imagePopupSource.asObservable();
  imageDelete$: Observable<string> = this.imageDeleteSource.asObservable();
  imageClose$: Observable<string> = this.imageCloseSource.asObservable();

  popup(links: ImageMessageModel[], images: File[], weixinLocalIds: string[], canDelete: boolean) {
    let imagePopupModel = new ImgPopupModel(links, images, weixinLocalIds, canDelete);
    this.imagePopupSource.next(imagePopupModel);
  }

  delete() {
    this.imageDeleteSource.next('');
  }

  close() {
    this.imageCloseSource.next('');
  }
}
