import {Component, OnInit} from '@angular/core';
import { NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {RequestService, EventsExchangeService} from '../../services/index';

@Component({
  selector: 'app-log-in',
  templateUrl: 'log-in.component.html',
  styleUrls: ['log-in.component.scss']
})
export class LogInComponent implements OnInit {

  error: any;

  email: string = '';
  password: string = '';

  WRONG_E_FORMAT: string;
  PASSWORD_LENGTH: string;

  constructor(private requestService : RequestService,
              private exchangeService: EventsExchangeService,
              private router: Router) { }


  ngOnInit() {


  }



  sendLogInData(regForm: NgForm, event:Event): void {

    event.preventDefault();

    this.requestService.logIn(regForm.value).subscribe(
        data=>{
          this.router.navigateByUrl('/explore');
        },
        error => {
          this.error = error.json();
          console.log(this.error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t log in'})
        }
    )

  }





}
