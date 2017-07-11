import { Component, OnInit} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs/Rx";

import {UserStoreService} from '../../services/user-store.service';

@Component({
  selector: 'app-can-activate',
  templateUrl: 'can-activate.component.html',
  styleUrls: ['can-activate.component.css']
})
export class CanActivateComponent implements OnInit, CanActivate{

  constructor(
              private router: Router,
              private storeservice: UserStoreService) {

  }

  ngOnInit() {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean{

    let currentUser = this.storeservice.getUserData();

    if (currentUser.token === 'guest'){

      if (state.url.indexOf('user-settings') >= 0  || state.url.indexOf('user-dialogs') >= 0 || state.url.indexOf('notifications') >= 0  || state.url.indexOf('about-user/0') >= 0 || state.url.indexOf('tifo-settings') >= 0) {

        this.router.navigateByUrl('/explore');
        return false;
      }

    }

    return true
  }



}
