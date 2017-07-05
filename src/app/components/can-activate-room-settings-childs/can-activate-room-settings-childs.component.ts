import { Component, OnInit } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs/Rx";

import {UserStoreService} from '../../services/user-store.service';

@Component({
  selector: 'app-can-activate-room-settings-childs',
  templateUrl: 'can-activate-room-settings-childs.component.html',
  styleUrls: ['can-activate-room-settings-childs.component.css']
})
export class CanActivateRoomSettingsChildsComponent implements OnInit {

  constructor(private storeservice: UserStoreService, private router: Router) { }

  ngOnInit() {
  }

  canActivate() : Observable<boolean> | boolean{
    let result = this.storeservice.getStoredCurrentUserRooms();
    !result && this.router.navigateByUrl('/explore');
    return result ? true : false
  }
}
