import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Router} from '@angular/router';
import { NgForm} from '@angular/forms';

import {UserStoreService, RequestService, EventsExchangeService, UploadFilesService} from '../../services/index';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-update-room',
  templateUrl: 'update-room.component.html',
  styleUrls: ['update-room.component.scss']
})
export class UpdateRoomComponent implements OnInit {

  error: any;
  currentRoom: any;
  publicFlag: boolean = true;
  searchableFlag: boolean = true;
  dataToServer: any = {};
  roomName: string = '';
  roomDeskription: string = '';
    roomAlias: string = '';
    subscription: any;
    added_image: any;
    image_dropped:boolean;
    button_disabled:boolean;
    cropperSettings: CropperSettings;
    changed_data:boolean;
    tags: any[];
    tagsChangetFlag: boolean;

    @ViewChild('cropper', undefined)
    cropper:ImageCropperComponent;

    @ViewChild('previewImg') previewed:ElementRef;

  constructor(  private requestService: RequestService,
               private storeservice: UserStoreService,
               private router: Router,
               private fileUpload: UploadFilesService,
               private exchangeService: EventsExchangeService) {

      this.cropperSettings = new CropperSettings();
      this.cropperSettings.noFileInput = true;
      this.cropperSettings.width = 255;
      this.cropperSettings.height = 255;
      this.cropperSettings.minWithRelativeToResolution = true;
      this.cropperSettings.fileType = 'image/jpeg';
      this.cropperSettings.preserveSize = true;
      this.cropperSettings.dynamicSizing = true;
      this.cropperSettings.cropperClass = 'cropper_field';

      this.added_image = {};
  }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    this.roomName = this.currentRoom.room_details.room_name;
    this.roomAlias = this.currentRoom.room_details.room_alias;
    this.dataToServer['multimedia'] = '';
    this.tags = this.currentRoom.room_details.tags && this.currentRoom.room_details.tags.split(' ') || [];
    this.roomDeskription = this.currentRoom.room_details.room_desc;
    this.publicFlag = !!this.currentRoom.room_details.public;
    this.searchableFlag = !!this.currentRoom.room_details.searchable_flag;
  }

    fileDropped(event: any): void {

        this.image_dropped = true;

        let image:any = new Image();
        let that = this;
        let myReader:FileReader = new FileReader();

            let file:File = event.target.files[0];
            myReader.onloadend = function (loadEvent:any) {
                image.src = loadEvent.target.result;
                that.cropper.setImage(image);
            };
            myReader.readAsDataURL(file);
    }

    updateTheRoom(roomForm: NgForm, event: Event):void {

      event.preventDefault();
        this.button_disabled = true;

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

        if (this.changed_data || this.image_dropped || this.tagsChangetFlag){

            if (this.tagsChangetFlag){

                roomForm.value['tags'] = '';
                for (let i = 0; i < this.tags.length; i++){
                    if ( typeof this.tags[i] === 'string'){
                        roomForm.value['tags'] += " " + this.tags[i];
                    } else {
                        roomForm.value['tags'] += " " + this.tags[i]['value'];
                    }

                }
            }

            this.dataToServer['roomData'] = roomForm.value;
            this.dataToServer.room_id = this.currentRoom.room_details.room_id;
            this.requestService.updateRoom(this.dataToServer).subscribe(
                data=>{
                    this.currentRoom.room_details =  data.room;
                    this.storeservice.storeCurrentUserRooms(this.currentRoom);
                    this.router.navigateByUrl('/tifo-settings');
                    this.exchangeService.doShowVisualMessageForUser({success:true, message: 'Room information changed successful'})
                    this.button_disabled = false;
                    this.image_dropped = false;
                    this.added_image = {};
                    this.changed_data = false
                },
                error => {
                    this.error = error;
                    console.log(error);
                    this.button_disabled = false;
                    this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t save changes'})}
            );
        } else {
            this.button_disabled = false;
        }

    }

    haveChangedData(flag: string, value:any):void {

        if (flag === 'room_name'){
            let name = value && value.trim();
            name && name !== this.currentRoom.room_details.room_name ? this.changed_data = true : this.changed_data = false;
        }

        if (flag === 'room_alias'){
            let dispName = value && value.trim();
            dispName && dispName !== this.currentRoom.room_details.room_alias ? this.changed_data = true : this.changed_data = false;
        }

        if (flag === 'room_desc'){
            let about = value && value.trim();
            about && about !== this.currentRoom.room_details.room_desc ? this.changed_data = true : this.changed_data = false;
        }

        if (flag === 'public'){
            value != this.currentRoom.room_details.public ? this.changed_data = true : this.changed_data = false;
        }

        if (flag === 'searchable_flag'){
            value != this.currentRoom.room_details.searchable_flag ? this.changed_data = true : this.changed_data = false;
        }
    }

    tagsChanged(): void {

      this.tagsChangetFlag = true;
    }

}
