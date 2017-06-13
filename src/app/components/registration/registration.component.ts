import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {RequestService} from '../../services/request.service';
import {ErrorShowService} from '../../services/error-show.service';

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

  constructor(private requestService : RequestService, private errorService: ErrorShowService, private router: Router) { }
  @ViewChild("inputEmail")
  inputEmail: ElementRef;

  @ViewChild("inputName")
  inputName: ElementRef;

  ngOnInit() {
    this.emailMistake = 'Wrong email format';
    this.userNameMistake = 'Wrong user name or name length';
    this.passwordMistake = 'Password must be from 4 to 21 character length';
    this.buttonDisabled = false;
  }


  sendRegistrationData(regForm: NgForm): void {
    console.log(regForm)
    this.requestService.registration(regForm.value).subscribe(
        data=>{
          this.router.navigateByUrl('/all-rooms');
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
        this.emailMistake = 'Wrong email format';
        this.emailFieldState = true;
      }

      if (field === 'name' && data.trim() !== this.oldNameValue){
        this.oldNameValue = data;
        this.errorService.errorHide(this.inputName);
        this.userNameMistake = 'Wrong user name or name length';
        this.nameFieldState = true;
      }
       this.emailFieldState && this.nameFieldState ? this.buttonDisabled = false : this.buttonDisabled = true;
    }

  }

}
