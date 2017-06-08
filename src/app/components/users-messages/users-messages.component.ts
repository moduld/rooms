import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { RequestService } from '../../services/request.service';
import { FileInfoService } from '../../services/file-info.service';
import {UserStoreService} from '../../services/user-store.service';

@Component({
  selector: 'app-users-messages',
  templateUrl: 'users-messages.component.html',
  styleUrls: ['users-messages.component.scss']
})
export class UsersMessagesComponent implements OnInit, OnDestroy {


  @Input() eventFromParent:Subject<any>;
  error: any;
  inProcess: boolean;
  loaded_image_url: string;
  all_messages: any[];
  offset: number;
  show_loading: boolean;
  mediaToAppServer: any;
  flagMoveY: boolean = true;
  userWhoTalkToUs: any;
  firstMessageFlag: boolean;
  loginnedUser: any;

  constructor( private requestService: RequestService,
               private fileService: FileInfoService,
               private storeservice: UserStoreService) { }

  ngOnInit() {

    this.loginnedUser = this.storeservice.getUserData();
    this.all_messages = [];

    this.eventFromParent.subscribe(event => {

      this.firstMessageFlag = event.flag;
      console.log(event)
      this.userWhoTalkToUs = event.user;

      this.userChangedOrStart()
    });

  }

  ngOnDestroy() {

    this.eventFromParent.unsubscribe();
  }


  userChangedOrStart():void {

    this.inProcess = false;
    this.loaded_image_url = '';
    this.show_loading = false;
    this.all_messages = [];
    this.offset = 0;

    this.firstMessageFlag && this.getAllMessages()
  }

  getAllMessages():void {

    let dataToServer = {
      user_id_to: this.userWhoTalkToUs.user_id_to,
      offset_id: this.offset,
      direction_flag: 0
    };

    this.requestService.getUserMessages(dataToServer).subscribe(
        data=>{
          console.log(data)
          if (data['messages'].length){
            this.all_messages = this.all_messages.concat(data['messages']);
            this.flagMoveY = true;
          }

          this.show_loading = false;
        },
        error => {this.error = error; console.log(error);}
    );
  }



  fileDropped(event: any): void {

    this.mediaToAppServer = this.fileService.toNowFileInfo(event.srcElement.files[0]);

    if (this.mediaToAppServer.typeForApp === 'image' || this.mediaToAppServer.typeForApp === 'audio'){
      this.mediaToAppServer.typeForApp === 'image' ? this.mediaToAppServer.folder = 'messages/images/' : this.mediaToAppServer.folder = 'messages/audios/';
      this.inProcess = true;
      this.requestService.getLinkForFileUpload(this.mediaToAppServer).subscribe(
          data=>{
            this.mediaToAppServer.link = data.urls[0];
            this.putFileToServer(this.mediaToAppServer)
          },
          error => {this.error = error; console.log(error);}
      );
    }
  }

  putFileToServer(settings: any): void {

    this.requestService.fileUpload(settings).subscribe(
        data=>{
          this.inProcess = false;
          console.log(data)
          if (data.typeForApp === 'image'){
            this.loaded_image_url = data.multimedia
          }
        },
        error => {this.error = error; console.log(error);}
    );
  }



  sendNewMessage(messageForm: NgForm):void {


    if (messageForm.value.text || this.mediaToAppServer){
      let dataToServer = {
        user_id_to: this.userWhoTalkToUs.user_id_to,
        text: messageForm.value.text
      };

      if (this.mediaToAppServer){
        dataToServer['media'] = {
          type: this.mediaToAppServer['typeForApp'],
          multimedia: this.mediaToAppServer['multimedia']
        }
      } else {
        dataToServer['media'] = []
      }

      this.requestService.sendNewMessage(dataToServer).subscribe(
          data=>{
            this.all_messages.push(data['message']);
            // this.comment_offset = 0;
            // this.comments_sort_type = 'date_newer';
            // this.comments = [];
            // this.getComments();
            // this.loaded_image_url = ''
          },
          error => {this.error = error; console.log(error);}
      );

      messageForm.resetForm();
      this.mediaToAppServer = '';
    }

  }

  onScrollRichTheEnd(event): void {

    if (this.flagMoveY && this.all_messages.length){
        this.offset = this.all_messages[this.all_messages.length - 1].msg_id;
        this.getAllMessages();

      this.flagMoveY = false;
    }

  }

}
