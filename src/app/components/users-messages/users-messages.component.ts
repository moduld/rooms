import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() firstMessageSent = new EventEmitter<boolean>();
  error: any;
  inProcess: boolean;
  loaded_image_url: string;
  all_messages: any[];
  offset: number;
  show_loading: boolean;
  mediaToAppServer: any;
  flagMoveY: boolean = true;
  userWhoTalkToUs: any;
  virtualUserFlag: boolean;
  loginnedUser: any;
  showComponentBody: boolean;

  constructor( private requestService: RequestService,
               private fileService: FileInfoService,
               private storeservice: UserStoreService) { }

  ngOnInit() {

    this.loginnedUser = this.storeservice.getUserData();
    this.all_messages = [];

    this.eventFromParent.subscribe(event => {

      this.showComponentBody = true;
      this.virtualUserFlag = event.flag;
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

    this.virtualUserFlag && this.getAllMessages()
  }

  getAllMessages():void {

    let dataToServer = {
      user_id_to: this.userWhoTalkToUs.user.user_id,
      offset_id: this.offset,
      direction_flag: 0
    };
    this.show_loading = true;

    this.requestService.getUserMessages(dataToServer).subscribe(
        data=>{
          console.log(data)
          if (data['messages'].length){

            let temp = data['messages'].map((message, i)=>{
               message.user_id ===  this.userWhoTalkToUs.user.user_id ? message.avatar = this.userWhoTalkToUs.user.thumbnail : message.avatar = this.loginnedUser.user_data.thumbnail;

              return message
            });

            this.all_messages = this.all_messages.concat(temp);
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
        user_id_to: this.virtualUserFlag ? this.userWhoTalkToUs.user.user_id : this.userWhoTalkToUs.user_id,
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
            this.all_messages.unshift(data['message']);
            this.loaded_image_url = '';
            !this.virtualUserFlag && this.firstMessageSent.emit(true)
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

  deleteMessage(message: any, index:number):void {

    let dataToServer = {
      msg_id: message.msg_id
    };

    this.requestService.deleteMessage(dataToServer).subscribe(
        data=>{
          this.all_messages.splice(index, 1);
        },
        error => {this.error = error; console.log(error);}
    );
  }

}
