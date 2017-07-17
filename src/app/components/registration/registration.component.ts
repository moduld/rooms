import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {RequestService} from '../../services/request.service';
import {ErrorShowService} from '../../services/error-show.service';

import { TranslateService } from '@ngx-translate/core';

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
  oldEmailValue: string = '';
  oldNameValue: string = '';
  emailFieldState: boolean = true;
  nameFieldState: boolean = true;

  user_name: string = '';
  email: string = '';
  password: string = '';

  WRONG_E_FORMAT: string;
  PASSWORD_LENGTH: string;
  WRONG_NAME_OR_LENGTH: string;

  constructor(private requestService : RequestService,
              private errorService: ErrorShowService,
              private router: Router,
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
    this.translate.get('LOGIN_AND_REGISTER.WRONG_NAME_OR_LENGTH').subscribe(
        value => {
          this.WRONG_NAME_OR_LENGTH = value;
          this.userNameMistake = this.WRONG_NAME_OR_LENGTH;

        }
    );

    this.buttonDisabled = false;
  }


  sendRegistrationData(regForm: NgForm, event: Event): void {

    event.preventDefault();

    this.requestService.registration(regForm.value).subscribe(
        data=>{
          this.router.navigateByUrl('/explore');
        },
        error => {
          this.error = error.json();
          console.log(this.error);
          this.handleErrors(this.error)
        }
    )

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
    this.buttonDisabled = true;
  }

  changeState(field: string, data: string): void {
    if (this.buttonDisabled){
      if (field === 'email' && data.trim() !== this.oldEmailValue){
        this.oldEmailValue = data;
        this.errorService.errorHide(this.inputEmail);
        this.emailMistake = this.WRONG_E_FORMAT;
        this.emailFieldState = true;
      }

      if (field === 'name' && data.trim() !== this.oldNameValue){
        this.oldNameValue = data;
        this.errorService.errorHide(this.inputName);
        this.userNameMistake = this.WRONG_NAME_OR_LENGTH;
        this.nameFieldState = true;
      }
       this.emailFieldState && this.nameFieldState ? this.buttonDisabled = false : this.buttonDisabled = true;
    }

  }

}
