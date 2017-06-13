import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
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

  constructor( private storeservice: UserStoreService,
               private router: Router) { }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    !this.currentRoom && this.router.navigateByUrl('/all-rooms');
  }

}
