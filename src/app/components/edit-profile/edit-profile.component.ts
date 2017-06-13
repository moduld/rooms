import { Component, OnInit } from '@angular/core';

import { NgForm} from '@angular/forms';

import { RequestService } from '../../services/request.service';
import {UserStoreService} from '../../services/user-store.service';
import { FileInfoService } from '../../services/file-info.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: 'edit-profile.component.html',
  styleUrls: ['edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  error: any;
  messageFromAllUsers: boolean = true;
  dataToServer: any = {};
  imagePreview: string;
  userName: string;
  userDisplayedName: string;
  aboutUser: string;
  currentUser: any;

  constructor(private requestService: RequestService,
              private storeservice: UserStoreService,
              private fileService: FileInfoService,
              private exchangeService: EventsExchangeService) { }

  ngOnInit() {

    this.currentUser = this.storeservice.getUserData();
    this.dataToServer['multimedia'] = this.currentUser.user_data.thumbnail || '';
    this.imagePreview = this.currentUser.user_data.thumbnail;
    this.userName = this.currentUser.user_data.user_name;
    this.userDisplayedName = this.currentUser.user_data.display_name;
    this.aboutUser = this.currentUser.user_data.about;
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

  editUserProfile(editProfileForm: NgForm):void {

    this.dataToServer['userData'] = editProfileForm.value;
    this.requestService.editUserProfile(this.dataToServer).subscribe(
        data=>{
          let newUser = {
            token: this.currentUser.token,
            user_data: data.user
          };
          this.currentUser = this.storeservice.saveUserData(newUser);
            this.exchangeService.doShowVisualMessageForUser({success:true, message: 'User information changed successful'})
        },
        error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t save changes'})}
    );
  }

}
