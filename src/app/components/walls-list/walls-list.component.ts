import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {UserStoreService} from '../../services/user-store.service';
import { RequestService } from '../../services/request.service';

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

  constructor(private storeservice: UserStoreService,
              private requestService: RequestService,
              private router: Router) { }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    console.log(this.currentRoom)
    this.walls = this.currentRoom.walls;
    for (let i = this.walls.length; i--; this.walls[i].showDeleteConfirm = false){}
  }

  deleteWall(wall: any, index: number): void {

    this.requestService.deleteWall(wall).subscribe(
        data=>{
          this.walls.splice(index, 1);
          this.currentRoom.walls = this.walls;
          this.storeservice.storeCurrentUserRooms(this.currentRoom)
        }, error => {this.error = error; console.log(error);}
    );
  }


}
