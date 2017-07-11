import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {UserStoreService} from '../../services/user-store.service';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

import { Wall } from '../../commonClasses/wall';

@Component({
  selector: 'app-delete-room',
  templateUrl: 'delete-room.component.html',
  styleUrls: ['delete-room.component.scss']
})
export class DeleteRoomComponent implements OnInit {

  error: any;
  currentRoom: Wall;

  constructor(private requestService: RequestService,
              private storeservice: UserStoreService,
              private router: Router,
              private exchangeService: EventsExchangeService) { }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
  }

  deleteRoom():void {

    this.requestService.deleteRoom(this.currentRoom.room_details.room_id).subscribe(
        data=>{
          this.router.navigateByUrl('/my-tifos');
        }, error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t delete the room'})}
    );
  }

}
