import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { RequestService } from '../../services/request.service';
import { FileInfoService } from '../../services/file-info.service';
import {UserStoreService} from '../../services/user-store.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

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
  directionFlag: number;
  interval: any;

  constructor( private requestService: RequestService,
               private fileService: FileInfoService,
               private storeservice: UserStoreService,
               private exchangeService: EventsExchangeService) { }

  ngOnInit() {

    this.loginnedUser = this.storeservice.getUserData();
    this.all_messages = [];
    this.directionFlag = 0;

    this.eventFromParent.subscribe(event => {

      this.showComponentBody = true;
      this.virtualUserFlag = event.flag;
      this.userWhoTalkToUs = event.user;

      this.userChangedOrStart()
    });

  }

  ngOnDestroy() {

    clearInterval(this.interval);
    this.eventFromParent.unsubscribe();
  }


  userChangedOrStart():void {

    clearInterval(this.interval);
    this.inProcess = false;
    this.loaded_image_url = '';
    this.show_loading = false;
    this.all_messages = [];
    this.offset = 0;
    this.directionFlag = 0;

    this.virtualUserFlag && this.getAllMessages();

  }

  getAllMessages():void {

    let dataToServer = {
      user_id_to: this.userWhoTalkToUs.user.user_id,
      offset_id: this.offset,
      direction_flag: this.directionFlag
    };

    !this.directionFlag ? this.show_loading = true : '';

    clearInterval(this.interval);

    this.requestService.getUserMessages(dataToServer).subscribe(
        data=>{
          if (data['messages'].length){

            let temp = data['messages'].map((message, i)=>{
               message.user_id ===  this.userWhoTalkToUs.user.user_id ? message.avatar = this.userWhoTalkToUs.user.thumbnail : message.avatar = this.loginnedUser.user_data.thumbnail;

              return message
            });

            this.directionFlag ? this.all_messages = temp.concat(this.all_messages) : this.all_messages = this.all_messages.concat(temp);
            this.flagMoveY = true;
          }
          this.autocheckNewMessages();
          this.show_loading = false;
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get messages from a server'})}
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
          this.inProcess = false;
          console.log(data)
          if (data.typeForApp === 'image'){
            this.loaded_image_url = data.multimedia
          }
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t send the file'})}
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
          error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t send the message'})}
      );

      messageForm.resetForm();
      this.mediaToAppServer = '';
    }

  }

  onScrollRichTheEnd(event): void {

    if (this.flagMoveY && this.all_messages.length){
        this.directionFlag = 0;
        this.offset = this.all_messages[this.all_messages.length - 1].msg_id;
        this.getAllMessages();

        this.flagMoveY = false;
    }

  }

  deleteMessage(message: any, index:number, myne: boolean):void {

    if (myne){
      let dataToServer = {
        msg_id: message.msg_id
      };

      this.requestService.deleteMessage(dataToServer).subscribe(
          data=>{
            this.all_messages.splice(index, 1);
          },
          error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t delete the message'})}
      );
    }

  }

  autocheckNewMessages ():void {

    this.interval = setInterval(()=>{
      this.directionFlag = 1;
      this.offset = this.all_messages[0].msg_id || 0;
      this.getAllMessages();
    }, 10000);

  }

  // differentBetweenMessages(message: any): any {
  //
  //   let result = Math.floor((new Date().getTime() - message.created_at*1000)/86400000);
  //
  //   return result
  //
  // }

}
