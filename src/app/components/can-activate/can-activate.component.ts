import { Component, OnInit } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs/Rx";

import {UserStoreService} from '../../services/user-store.service';

@Component({
  selector: 'app-can-activate',
  templateUrl: 'can-activate.component.html',
  styleUrls: ['can-activate.component.css']
})
export class CanActivateComponent implements OnInit, CanActivate {

  constructor(private storeservice: UserStoreService, private router: Router) { }

  ngOnInit() {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean{
    let result = this.storeservice.getUserData();
    !result && this.router.navigateByUrl('/login');
    return result ? true : false
  }

}
