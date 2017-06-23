import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { NgForm} from '@angular/forms';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { RequestService } from '../../services/request.service';
import { FileInfoService } from '../../services/file-info.service';
import { EventsExchangeService } from '../../services/events-exchange.service';
import { UploadFilesService } from '../../services/upload-files.service';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';

@Component({
  selector: 'app-create-room',
  templateUrl: 'create-room.component.html',
  styleUrls: ['create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  error: any;
  publicFlag: boolean = true;
  searchableFlag: boolean = true;
  dataToServer: any = {};
  imagePreview: string = '';
  roomName: string = '';
  roomDeskription: string = '';
  subscription: any;
    added_image: any;
    image_dropped:boolean;

    cropperSettings: CropperSettings;

    @ViewChild('cropper', undefined)
    cropper:ImageCropperComponent;

    @ViewChild('previewImg') previewed:ElementRef;

  constructor(public activeModal: NgbActiveModal,
              private fileService: FileInfoService,
              private fileUpload: UploadFilesService,
              private requestService: RequestService,
              private exchangeService: EventsExchangeService) {

      exchangeService.urlChangedEvent.subscribe(
          () => {
              this.activeModal.dismiss()
          });


      this.cropperSettings = new CropperSettings();
      this.cropperSettings.noFileInput = true;
      this.cropperSettings.width = 255;
      this.cropperSettings.height = 255;
      this.cropperSettings.minWidth = 255;
      this.cropperSettings.minHeight = 255;
      this.cropperSettings.minWithRelativeToResolution = true;
      this.cropperSettings.fileType = 'image/jpeg';
      this.cropperSettings.preserveSize = true;
      this.cropperSettings.dynamicSizing = true;
      this.cropperSettings.cropperClass = 'cropper_field';

      this.added_image = {};
  }

  ngOnInit() {
    this.dataToServer['multimedia'] = '';

  }

  fileDropped(event: any): void {

        this.image_dropped = true;

        let image:any = new Image();
        let file:File = event.target.files[0];
        let myReader:FileReader = new FileReader();
        let that = this;
        myReader.onloadend = function (loadEvent:any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);

        };

        myReader.readAsDataURL(file);
  }



  createNewRoom(roomForm: NgForm):void {

      if (this.image_dropped){
          this.subscription = this.fileUpload.pushResolve.subscribe(result=>{

              this.dataToServer['multimedia'] = result.multimedia;
              this.sendTextData(roomForm);
              this.subscription.unsubscribe();
          });
          this.fileUpload.uploadFiles(this.previewed, 'rooms')
      } else {
          this.sendTextData(roomForm)
      }
  }

    sendTextData(roomForm: NgForm):void {

    this.dataToServer['roomData'] = roomForm.value;
    this.requestService.createNewRoom(this.dataToServer).subscribe(
        data=>{
            this.activeModal.close(data)
        },
        error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t create new room'})}
    );
}


}
