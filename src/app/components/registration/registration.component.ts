import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {RequestService, ErrorShowService, EventsExchangeService} from '../../services/index';

@Component({
  selector: 'app-registration',
  templateUrl: 'registration.component.html',
  styleUrls: ['registration.component.scss']
})

export class RegistrationComponent implements OnInit{

  error: any;
  emailMistake: string;
  userNameMistake: string;
  passwordMistake: string;
  buttonDisabled: boolean;
  oldFieldsValues: any = {name: '', email: ''};
  emailFieldState: boolean = true;
  nameFieldState: boolean = true;
  passFieldState: boolean = false;

  user_name: string = '';
  email: string = '';
  password: string = '';

  WRONG_E_FORMAT: string;
  PASSWORD_LENGTH: string;
  WRONG_NAME_LENGTH: string;
  WRONG_NAME_CHAR: string;

  constructor(private requestService : RequestService,
              private errorService: ErrorShowService,
              private router: Router,
              private exchangeService: EventsExchangeService,
              private translate: TranslateService) { }

  @ViewChild("inputEmail")
  inputEmail: ElementRef;

  @ViewChild("inputName")
  inputName: ElementRef;

  ngOnInit() {

    this.translate.get('LOGIN_AND_REGISTER.WRONG_E_FORMAT').subscribe(
        value => {
          this.WRONG_E_FORMAT = value;
          this.emailMistake = this.WRONG_E_FORMAT
        }
    );
    this.translate.get('LOGIN_AND_REGISTER.PASSWORD_LENGTH').subscribe(
        value => {
          this.PASSWORD_LENGTH = value;
          this.passwordMistake = this.PASSWORD_LENGTH
        }
    );
    this.translate.get('LOGIN_AND_REGISTER.MIN_NAME_LENGTH').subscribe(
        value => {
          this.WRONG_NAME_LENGTH = value;

        }
    );

    this.translate.get('LOGIN_AND_REGISTER.WRONG_USER_NAME').subscribe(
        value => {
          this.WRONG_NAME_CHAR = value;

        }
    );

    this.buttonDisabled = true;
  }


  sendRegistrationData(regForm: NgForm, event: Event): void {

    event.preventDefault();

    if (regForm.value.user_name && regForm.value.email && regForm.value.password){

      this.requestService.registration(regForm.value).subscribe(
          data=>{
            this.router.navigateByUrl('/explore');
            this.exchangeService.doShowVisualMessageForUser({success:true, message: data.message || 'Check your e-mail'})
          },
          error => {
            this.error = error.json();
            this.oldFieldsValues['name'] = regForm.value.user_name;
            this.oldFieldsValues['email'] = regForm.value.email;
            this.buttonDisabled = true;
            this.handleErrors(this.error)
          }
      )
    } else {

    }



  }

  handleErrors(error): void {

    if (error.email){
      this.emailMistake =  error.email[0];
      this.errorService.errorShow(this.inputEmail);
      this.emailFieldState = false;
    }
    if (error.user_name){
      this.userNameMistake = error.user_name[0];
      this.errorService.errorShow(this.inputName);
      this.nameFieldState = false;
    }

  }

  changeState(field: string, data: string): void {


    if (this.buttonDisabled){
      if (field === 'email' && this.oldFieldsValues.email && data.trim() !== this.oldFieldsValues.email){
        this.errorService.errorHide(this.inputEmail);
        this.emailMistake = this.WRONG_E_FORMAT;
        this.emailFieldState = true;
      }

      if (field === 'name'){
        if (data.length < 3){this.userNameMistake = this.WRONG_NAME_LENGTH; return}
        if (!(/^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/.test(data))){this.userNameMistake = this.WRONG_NAME_CHAR; return}
      }

      if (field === 'name' && this.oldFieldsValues.name && data.trim() !== this.oldFieldsValues.name){


        this.errorService.errorHide(this.inputName);
        this.userNameMistake = this.WRONG_NAME_CHAR;
        this.nameFieldState = true;
      }

      if (field === 'password'){
        data && data.trim() ? this.passFieldState = true : this.passFieldState = false
      }
       this.emailFieldState && this.nameFieldState && this.passFieldState ? this.buttonDisabled = false : this.buttonDisabled = true;
    }

  }

}
