import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { NgForm} from '@angular/forms';

import {UserStoreService} from '../../services/user-store.service';
import { RequestService } from '../../services/request.service';

import { Wall } from '../../commonClasses/wall';

@Component({
  selector: 'app-edit-wall',
  templateUrl: 'edit-wall.component.html',
  styleUrls: ['edit-wall.component.scss']
})
export class EditWallComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  error: any;
  wallName: string = '';
  postFlag: boolean = true;
  commentFlag: boolean = true;
  currentRoom: Wall;
  currentWall: any;
  dataToServer: any;
  wallId: any;

  constructor(private activateRoute: ActivatedRoute,
               private requestService: RequestService,
              private storeservice: UserStoreService,
              private router: Router) { }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    this.subscription = this.activateRoute.params.subscribe(params=>{this.wallId = params.id});
    for (let i = 0; i < this.currentRoom.walls.length; i++){
      this.currentRoom.walls[i].wall_id == this.wallId ? this.currentWall =  this.currentRoom.walls[i] : ''

    }
    console.log(this.currentWall)
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
