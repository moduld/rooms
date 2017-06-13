import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {UserStoreService} from '../../services/user-store.service';
import { RequestService } from '../../services/request.service';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { EventsExchangeService } from '../../services/events-exchange.service';

import { Wall } from '../../commonClasses/wall';

@Component({
  selector: 'app-walls-list',
  templateUrl: 'walls-list.component.html',
  styleUrls: ['walls-list.component.scss']
})
export class WallsListComponent implements OnInit {

  error: any;
  currentRoom: Wall;
  walls: any[] = [];
  showDeleteBlock: boolean;
  dataToServer: any = {};


  constructor(private storeservice: UserStoreService,
              private requestService: RequestService,
              private router: Router,
              private dragulaService: DragulaService,
              private exchangeService: EventsExchangeService) {

    dragulaService.drop.subscribe((event) => {
    });
  }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    this.walls = this.currentRoom.walls;
    for (let i = this.walls.length; i--; this.walls[i].showDeleteConfirm = false){}
  }

  deleteWall(wall: any, index: number): void {

    this.requestService.deleteWall(wall).subscribe(
        data=>{
          this.walls.splice(index, 1);
          this.currentRoom.walls = this.walls;
          this.storeservice.storeCurrentUserRooms(this.currentRoom)
        }, error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t delete the wall'})}
    );
  }

  saveOrder(): void {

    this.dataToServer.room_id = this.currentRoom.room_details.room_id;
    this.dataToServer.walls_order = [];
    for (let i = 0; i < this.walls.length; i++){
      this.dataToServer.walls_order.push({wall_id: this.walls[i].wall_id, wall_level: i + 1})
    }

    this.requestService.changeWallOrder(this.dataToServer).subscribe(
        data=>{
          this.exchangeService.doShowVisualMessageForUser({success:true, message: 'Walls order saved'})
        }, error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t save walls order'})}
    );
  }


}
