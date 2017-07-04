import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { NgForm} from '@angular/forms';

import {UserStoreService} from '../../services/user-store.service';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';
import { Wall } from '../../commonClasses/wall';

@Component({
  selector: 'app-edit-wall',
  templateUrl: 'edit-wall.component.html',
  styleUrls: ['edit-wall.component.scss']
})
export class EditWallComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  error: any;
  wallName: string;
  postFlag: boolean;
  commentFlag: boolean;
  currentRoom: Wall;
  currentWall: any;
  dataToServer: any;
  wallId: any;
  index: number;

  constructor(private activateRoute: ActivatedRoute,
               private requestService: RequestService,
              private storeservice: UserStoreService,
              private router: Router,
              private exchangeService: EventsExchangeService) { }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    this.subscription = this.activateRoute.params.subscribe(params=>{this.wallId = params.id});
    for (let i = 0; i < this.currentRoom.walls.length; i++){
      if (this.currentRoom.walls[i].wall_id == this.wallId){
        this.currentWall =  this.currentRoom.walls[i];
        this.index = i
      }

    }
    this.wallName = this.currentWall.wall_name;
    this.commentFlag = this.currentWall.allow_comment_flag;
    this.postFlag = this.currentWall.allow_post_flag
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateWall(updateForm: NgForm, event: Event): void {

    event.preventDefault();

    let name = updateForm.value.wall_name.trim();
    if(name){
      updateForm.value.wall_name = name;
      this.dataToServer = updateForm.value;
      this.dataToServer.room_id = this.currentWall.room_id;
      this.dataToServer.wall_id = this.currentWall.wall_id;

      this.requestService.updateWall(this.dataToServer).subscribe(
          data=>{
            this.currentRoom.walls[this.index] = data.wall;
            this.storeservice.storeCurrentUserRooms(this.currentRoom);
            this.router.navigateByUrl('/room-settings');
            this.exchangeService.doShowVisualMessageForUser({success:true, message: 'Wall changed successful'})
          },
          error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t save changes'})}
      );
    }

  }

}
