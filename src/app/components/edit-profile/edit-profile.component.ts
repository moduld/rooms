import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { NgForm} from '@angular/forms';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';

import { RequestService, UserStoreService, EventsExchangeService, UploadFilesService } from '../../services/index';

@Component({
  selector: 'app-edit-profile',
  templateUrl: 'edit-profile.component.html',
  styleUrls: ['edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  error: any;
  messageFromAllUsers: boolean;
  dataToServer: any = {};
  userName: string;
  userDisplayedName: string;
  aboutUser: string;
  currentUser: any;
  added_image: any;
  image_dropped:boolean;
  subscription: any;
  button_disabled:boolean;
  changed_data:boolean;
  cropperSettings: CropperSettings;

    @ViewChild('cropper', undefined)
    cropper:ImageCropperComponent;

    @ViewChild('previewImg') previewed:ElementRef;

  constructor(private requestService: RequestService,
              private storeservice: UserStoreService,
              private fileUpload: UploadFilesService,
              private exchangeService: EventsExchangeService) {

      this.cropperSettings = new CropperSettings();
      this.cropperSettings.noFileInput = true;
      this.cropperSettings.width = 150;
      this.cropperSettings.height = 150;
      this.cropperSettings.minWithRelativeToResolution = true;
      this.cropperSettings.fileType = 'image/jpeg';
      this.cropperSettings.preserveSize = true;
      this.cropperSettings.dynamicSizing = true;
      this.cropperSettings.cropperClass = 'cropper_field';

      this.added_image = {};
  }

  ngOnInit() {

    this.currentUser = this.storeservice.getUserData();
    this.dataToServer['multimedia'] = '';
    this.userName = this.currentUser.user_data.user_name;
    this.userDisplayedName = this.currentUser.user_data.display_name;
    this.aboutUser = this.currentUser.user_data.about;
    this.messageFromAllUsers = this.currentUser.user_data.msg_from_anyone;
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

    editUserProfile(editProfileForm: NgForm, event: Event):void {

      event.preventDefault();
        this.button_disabled = true;
        if (this.image_dropped){
            this.subscription = this.fileUpload.pushResolve.subscribe(result=>{

                this.dataToServer['multimedia'] = result.multimedia;
                this.sendUserInfo(editProfileForm);
                this.subscription.unsubscribe();
            });
            this.fileUpload.uploadFiles(this.previewed, 'users')
        } else {
            this.sendUserInfo(editProfileForm)
        }
    }

    sendUserInfo(editProfileForm: NgForm):void {


        if (this.changed_data || this.image_dropped){
            this.dataToServer['userData'] = editProfileForm.value;
            this.requestService.editUserProfile(this.dataToServer).subscribe(
                data=>{
                    let newUser = {
                        token: this.currentUser.token,
                        user_data: data.user
                    };
                    this.storeservice.saveUserData(newUser);
                    this.currentUser = this.storeservice.getUserData();
                    this.exchangeService.doShowVisualMessageForUser({success:true, message: 'User information changed successful'});
                    this.exchangeService.changeUserAvatar();
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

      if (flag === 'user_name'){
          let name = value && value.trim();
          name && name !== this.currentUser.user_data.user_name ? this.changed_data = true : this.changed_data = false;
      }

        if (flag === 'disp_name'){
            let dispName = value && value.trim();
            dispName && dispName !== this.currentUser.user_data.display_name ? this.changed_data = true : this.changed_data = false;
        }

        if (flag === 'about_user'){
            let about = value && value.trim();
            about && about !== this.currentUser.user_data.about ? this.changed_data = true : this.changed_data = false;
        }

        if (flag === 'get_message'){
            value != this.currentUser.user_data.msg_from_anyone ? this.changed_data = true : this.changed_data = false;
        }
    }


}
