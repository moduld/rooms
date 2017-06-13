import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { NgForm} from '@angular/forms';

import {UserStoreService} from '../../services/user-store.service';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

import { Wall } from '../../commonClasses/wall';

@Component({
  selector: 'app-add-wall',
  templateUrl: 'add-wall.component.html',
  styleUrls: ['add-wall.component.scss']
})
export class AddWallComponent implements OnInit {

  error: any;
  wallName: string = '';
  postFlag: boolean = true;
  commentFlag: boolean = true;
  currentRoom: Wall;
  dataToServer: any;

  constructor(private requestService: RequestService,
              private storeservice: UserStoreService,
              private router: Router,
              private exchangeService: EventsExchangeService) { }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
  }

  createNewWall(wallForm: NgForm):void {

    this.dataToServer = wallForm.value;
    this.dataToServer.room_id = this.currentRoom.room_details.room_id;
    this.requestService.newWall(this.dataToServer).subscribe(
        data=>{
          this.currentRoom.walls.push(data.wall);
          this.storeservice.storeCurrentUserRooms(this.currentRoom);
          this.router.navigateByUrl('/room-settings');
          this.exchangeService.doShowVisualMessageForUser({success:true, message: 'Wall added successful'})
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t add new wall'})}
    );
  }

}
