import { Component, OnInit, Input } from '@angular/core';

import { NgForm} from '@angular/forms';


import { RequestService } from '../../services/request.service';
import { FileInfoService } from '../../services/file-info.service';

@Component({
  selector: 'app-update-room',
  templateUrl: 'update-room.component.html',
  styleUrls: ['update-room.component.scss']
})
export class UpdateRoomComponent implements OnInit {

  error: any;
  publicFlag: boolean = true;
  searchableFlag: boolean = true;
  dataToServer: any = {};
  imagePreview: string = '';
  roomName: string = '';
  roomDeskription: string = '';


  constructor( private fileService: FileInfoService, private requestService: RequestService) { }

  ngOnInit() {
    // this.roomName = this.room.room_details.room_name;
    // this.imagePreview = this.room.room_details.thumbnail || '';
    // this.dataToServer['multimedia'] = this.room.room_details.thumbnail || '';
    // this.roomDeskription = this.room.room_details.room_desc;
    // this.publicFlag = this.room.room_details.public;
    // this.searchableFlag = this.room.room_details.searchable_flag;
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

  updateTheRoom(roomForm: NgForm):void {

    // this.dataToServer['roomData'] = roomForm.value;
    // this.dataToServer.room_id = this.room.room_details.room_id;
    // this.requestService.updateRoom(this.dataToServer).subscribe(
    //     data=>{
    //       this.activeModal.close(data)
    //     },
    //     error => {this.error = error; console.log(error);}
    // );
  }

}
