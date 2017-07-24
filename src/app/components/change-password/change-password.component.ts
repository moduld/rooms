import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { NgForm} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import {RequestService, ErrorShowService, UserStoreService, EventsExchangeService} from '../../services/index';

@Component({
  selector: 'app-change-password',
  templateUrl: 'change-password.component.html',
  styleUrls: ['change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  old_pass_vall: string;
  new_pass_vall: string;
  mistake: string;
  buttonDisabled: boolean;
  oldNewPassValue: string;

  PASSWORD_LENGTH: string;
  IDENTICAL: string;

  @ViewChild("old_pass")
  oldPass: ElementRef;

  @ViewChild("new_pass")
  newPass: ElementRef;

  constructor(private requestService : RequestService,
              private errorService: ErrorShowService,
              private storeservice: UserStoreService,
              private exchangeService: EventsExchangeService,
              private translate: TranslateService) { }

  ngOnInit() {

    this.translate.get('CHANGE_PASSWORD.PASSWORD_LENGTH').subscribe(
        value => {
          this.PASSWORD_LENGTH = value;
          this.mistake = this.PASSWORD_LENGTH
        }
    );
    this.translate.get('CHANGE_PASSWORD.IDENTICAL').subscribe(
        value => {
          this.IDENTICAL = value;
        }
    );

    this.buttonDisabled = false;

  }


  changePassword(regForm: NgForm, event: Event): void {

    event.preventDefault();
    // let oldPas = regForm.value.old_password && regForm.value.old_password.trim();
    // let newPas = regForm.value.new_password && regForm.value.new_password.trim();

    if (regForm.value.old_password === regForm.value.new_password){
      this.handleErrors(regForm.value.new_password)
    } else {

      this.requestService.changePassword(regForm.value).subscribe(
          data=>{
            let currentUser = this.storeservice.getUserData();
            currentUser.token = data.token;
            this.storeservice.saveUserData(currentUser);
            this.requestService.setServiceVariables();
            this.exchangeService.doShowVisualMessageForUser({success:true, message: data.message || 'Password successfully changed'})
          },
          error => {
            console.log(error);
            this.buttonDisabled = false;
            this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t save changes'})
          }
      )
    }
  }

  handleErrors(newPass: string): void {

    this.oldNewPassValue = newPass;
    this.mistake = this.IDENTICAL;
    this.errorService.errorShow(this.newPass);
    this.buttonDisabled = true;
  }

  changeState(data: string): void {
      if (this.buttonDisabled && data.trim() !== this.oldNewPassValue){
        this.oldNewPassValue = data;
        this.errorService.errorHide(this.newPass);
        this.mistake = this.PASSWORD_LENGTH;
        this.buttonDisabled = false
      }
  }
}
