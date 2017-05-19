import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {UserStoreService} from '../../services/user-store.service';
import { RequestService } from '../../services/request.service';

import { Wall } from '../../commonClasses/wall';

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.scss']
})
export class RoomSettingsComponent implements OnInit {

  error: any;
  currentRoom: Wall;
  showDeleteBlock: boolean;
  constructor( private storeservice: UserStoreService,
               private requestService: RequestService,
               private router: Router) { }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    console.log(this.currentRoom)
  }

  deleteRoom():void {

    this.requestService.deleteRoom(this.currentRoom.room_details.room_id).subscribe(
        data=>{
          console.log(data);
          this.router.navigateByUrl('/all-rooms');
        }, error => {this.error = error; console.log(error);}
    );
  }

}
