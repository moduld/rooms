import { Component, OnInit } from '@angular/core';

import {UserStoreService} from '../../services/user-store.service';

import { Wall } from '../../commonClasses/wall';

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.scss']
})
export class RoomSettingsComponent implements OnInit {

  error: any;
  currentRoom: Wall;
  menu_show_toggle: boolean;

  constructor( private storeservice: UserStoreService) { }

  ngOnInit() {
    this.menu_show_toggle = true;
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
  }

}
