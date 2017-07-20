import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { FileInfoService } from './file-info.service';
import { EventsExchangeService } from './events-exchange.service';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UploadFilesService {

    private resolve = new Subject<any>();
    pushResolve = this.resolve.asObservable();

  constructor(private fileService: FileInfoService,
              private requestService: RequestService,
              private exchangeService: EventsExchangeService) { }



  uploadFiles(previewed:any, place: string): void {

          var byteString = atob(previewed.nativeElement.currentSrc.split(',')[1]);

          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }

    let blob: any = new Blob([ab], {type: 'image/jpeg' });


    blob.lastModifiedDate = new Date();
    blob.name = 'new_file.jpeg';
    let settings = this.fileService.toNowFileInfo(blob, place);

    this.makeRequests(settings)

  }

    makeRequests(settings:any):void {

      this.requestService.getLinkForFileUpload(settings).subscribe(
            data=>{
                settings.link = data.urls[0];

                let dataToServer = {};

                return this.requestService.fileUpload(settings).subscribe(
                    data=>{
                        dataToServer['multimedia'] = settings.multimedia;
                        this.resolve.next(dataToServer);
                    },
                    error => {
                        console.log(error);
                        this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t send the file'});
                    }

                );

            },
            error => {
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get link for the file'});
            }
        )


}

}
