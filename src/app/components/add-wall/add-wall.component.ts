import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { NgForm} from '@angular/forms';

import {UserStoreService} from '../../services/user-store.service';
import { RequestService } from '../../services/request.service';

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
              private router: Router) { }

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
        },
        error => {this.error = error; console.log(error);}
    );
  }

}
