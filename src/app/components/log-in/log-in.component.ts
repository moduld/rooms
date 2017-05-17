import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {RequestService} from '../../services/request.service';
import {ErrorShowService} from '../../services/error-show.service';

@Component({
  selector: 'app-log-in',
  templateUrl: 'log-in.component.html',
  styleUrls: ['log-in.component.scss']
})
export class LogInComponent implements OnInit {

  error: any;
  emailMistake: string;
  passwordMistake: string;
  buttonDisabled: boolean;
  oldEmailValue: string = '';
  oldPasswordValue: string = '';
  emailFieldState: boolean = true;
  passwordFieldState: boolean = true;

  email: string = '';
  password: string = '';

  constructor(private requestService : RequestService, private errorService: ErrorShowService, private router: Router) { }
  @ViewChild("inputEmail")
  inputEmail: ElementRef;

  @ViewChild("inputPassword")
  inputPassword: ElementRef;

  ngOnInit() {
    this.emailMistake = 'Wrong email format';
    this.passwordMistake = 'Password must be from 4 to 21 character length';
    this.buttonDisabled = false;
  }

  sendLogInData(regForm: NgForm): void {
    console.log(regForm)
    this.requestService.logIn(regForm.value).subscribe(
        data=>{
          console.log(data);
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

    this.emailMistake = 'Wrong email or password';
    this.passwordMistake = 'Wrong email or password';
    this.errorService.errorShow(this.inputEmail);
    this.errorService.errorShow(this.inputPassword);
    this.emailFieldState = false;
    this.passwordFieldState = false;
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

      if (field === 'password' && data.trim() !== this.oldPasswordValue){
        this.oldPasswordValue = data;
        this.errorService.errorHide(this.inputPassword);
        this.passwordMistake = 'Password must be from 4 to 21 character length';
        this.passwordFieldState = true;
      }
      this.emailFieldState && this.passwordFieldState ? this.buttonDisabled = false : this.buttonDisabled = true;
    }

  }

}
