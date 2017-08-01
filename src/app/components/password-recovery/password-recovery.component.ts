import {Component, OnInit} from '@angular/core';
import { NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {RequestService, EventsExchangeService} from '../../services/index';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {

  error: any;
  email: string = '';

  constructor(private requestService : RequestService,
              private exchangeService: EventsExchangeService,
              private router: Router) { }

  ngOnInit() {
  }

  sendEmail(recoveryForm: NgForm, event:Event): void {

    event.preventDefault();

    this.requestService.passwordRecovery(recoveryForm.value).subscribe(
        data=>{
          this.exchangeService.doShowVisualMessageForUser({success:true, message: data.message || 'Reset link was sent to your email'});
          this.router.navigateByUrl('/login');
        },
        error => {
          this.error = error;
          console.log(this.error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t send email'})
        }
    )

  }

}
