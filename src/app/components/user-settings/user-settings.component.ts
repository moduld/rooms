import { Component, OnInit } from '@angular/core';
import {UserStoreService} from '../../services/user-store.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: 'user-settings.component.html',
  styleUrls: ['user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  currentUser: any;

  constructor(private storeservice: UserStoreService) { }

  ngOnInit() {

    this.currentUser = this.storeservice.getUserData();
  }

}
