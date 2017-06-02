import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {UserStoreService} from '../../services/user-store.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: 'user-settings.component.html',
  styleUrls: ['user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  currentUser: any;

  constructor(private storeservice: UserStoreService, private router: Router) { }

  ngOnInit() {

    this.currentUser = this.storeservice.getUserData();
    this.router.navigateByUrl('user-settings/about-user/' + this.currentUser.user_data.user_id);
  }

}
