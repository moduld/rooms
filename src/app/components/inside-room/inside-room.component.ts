import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import { RequestService } from '../services/request.service';
import { EventsExchangeService } from '../services/events-exchange.service';

import { Wall } from '../commonClasses/wall';
import { Post } from '../commonClasses/posts';


@Component({
  selector: 'app-inside-room',
  templateUrl: 'inside-room.component.html',
  styleUrls: ['inside-room.component.css']
})
export class InsideRoomComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  error: any;
  roomId: any;
  wallId: any;
  allPosts: Post[];


  constructor(private activateRoute: ActivatedRoute, private requestService: RequestService, private exchangeService: EventsExchangeService){
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription = this.activateRoute.params.subscribe(params=>{this.roomId = params.id});

    this.requestService.getWalls(this.roomId).subscribe(
        data=>{
          this.wallId = data.walls[0].wall_id;
          // console.log(data)
          this.exchangeService.wallsToHeader(data);
          this.getPosts(this.wallId);
          },
        error => {this.error = error; console.log(error);}
    )
  }

  getPosts(wallId: number): void {
    this.requestService.getRoomPosts(this.wallId).subscribe(
        data=>{
          console.log(data);
          this.allPosts = data;
        },
        error => {this.error = error; console.log(error);}
    )
  }

}
