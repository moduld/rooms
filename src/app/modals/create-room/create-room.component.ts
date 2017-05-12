import { Component, OnInit } from '@angular/core';

import { NgForm} from '@angular/forms';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { RequestService } from '../../services/request.service';
import { FileInfoService } from '../../services/file-info.service';

@Component({
  selector: 'app-create-room',
  templateUrl: 'create-room.component.html',
  styleUrls: ['create-room.component.css']
})
export class CreateRoomComponent implements OnInit {

  error: any;
  publicFlag: boolean = true;
  searchableFlag: boolean = true;
  dataToServer: any = {};
  imagePreview: string = '';
  roomName: string = '';
  roomDeskription: string = '';

  constructor(public activeModal: NgbActiveModal, private fileService: FileInfoService, private requestService: RequestService) { }

  ngOnInit() {
    this.dataToServer['multimedia'] = '';
  }

  fileDropped(event: any): void {
    let settings = this.fileService.toNowFileInfo(event.srcElement.files[0]);
    if (settings && settings['typeForApp'] === 'image') {

      this.requestService.getLinkForFileUpload(settings).subscribe(
          data=>{
            settings.link = data.urls[0];
            this.putFileToServer(settings)
          },
          error => {this.error = error; console.log(error);}
      );
    }
  }

  putFileToServer(settings: any): void {

    this.requestService.fileUpload(settings).subscribe(
        data=>{
          this.imagePreview = settings.multimedia;
          this.dataToServer['multimedia'] = settings.multimedia;
        },
        error => {this.error = error; console.log(error);}
    );
  }

  createNewRoom(roomForm: NgForm):void {

    this.dataToServer['roomData'] = roomForm.value;
    this.requestService.createNewRoom(this.dataToServer).subscribe(
        data=>{
          this.activeModal.close(data)
        },
        error => {this.error = error; console.log(error);}
    );
  }

}
