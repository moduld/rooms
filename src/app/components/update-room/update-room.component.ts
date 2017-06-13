import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';
import { NgForm} from '@angular/forms';

import {UserStoreService} from '../../services/user-store.service';
import { RequestService } from '../../services/request.service';
import { FileInfoService } from '../../services/file-info.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

import { Wall } from '../../commonClasses/wall';

@Component({
  selector: 'app-update-room',
  templateUrl: 'update-room.component.html',
  styleUrls: ['update-room.component.scss']
})
export class UpdateRoomComponent implements OnInit {

  error: any;
  currentRoom: Wall;
  publicFlag: boolean = true;
  searchableFlag: boolean = true;
  dataToServer: any = {};
  imagePreview: string = '';
  roomName: string = '';
  roomDeskription: string = '';


  constructor( private fileService: FileInfoService,
               private requestService: RequestService,
               private storeservice: UserStoreService,
               private router: Router,
               private exchangeService: EventsExchangeService) { }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    this.roomName = this.currentRoom.room_details.room_name;
    this.imagePreview = this.currentRoom.room_details.thumbnail || '';
    this.dataToServer['multimedia'] = this.currentRoom.room_details.thumbnail || '';
    this.roomDeskription = this.currentRoom.room_details.room_desc;
    this.publicFlag = !!this.currentRoom.room_details.public;
    this.searchableFlag = !!this.currentRoom.room_details.searchable_flag;
  }

  fileDropped(event: any): void {
    let settings = this.fileService.toNowFileInfo(event.srcElement.files[0]);
    if (settings && settings['typeForApp'] === 'image') {

      this.requestService.getLinkForFileUpload(settings).subscribe(
          data=>{
            settings.link = data.urls[0];
            this.putFileToServer(settings)
          },
          error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get link for the file'})}
      );
    }
  }

  putFileToServer(settings: any): void {

    this.requestService.fileUpload(settings).subscribe(
        data=>{
          this.imagePreview = settings.multimedia;
          this.dataToServer['multimedia'] = settings.multimedia;
        },
        error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t send the file'})}
    );
  }

  updateTheRoom(roomForm: NgForm):void {

    this.dataToServer['roomData'] = roomForm.value;
    this.dataToServer.room_id = this.currentRoom.room_details.room_id;
    this.requestService.updateRoom(this.dataToServer).subscribe(
        data=>{
          this.currentRoom.room_details =  data.room;
          this.storeservice.storeCurrentUserRooms(this.currentRoom);
          this.router.navigateByUrl('/room-settings');
            this.exchangeService.doShowVisualMessageForUser({success:true, message: 'Room information changed successful'})
        },
        error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t save changes'})}
    );
  }

}
