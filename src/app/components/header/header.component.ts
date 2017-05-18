import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {RequestService} from '../../services/request.service';
import {UserStoreService} from '../../services/user-store.service';
import { EventsExchangeService } from '../../services/events-exchange.service';


@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit {

  error: any;
  currentRoom: any = {};

  subheaderWall: any[] = [];
  subheaderRoomName: string = '';
  headerFieldToggle: boolean;

  constructor(private requestService : RequestService,
              private storeservice: UserStoreService,
              private exchangeService: EventsExchangeService,
              private router: Router) {

    exchangeService.changeEmitted.subscribe(
        allWalls => {
          this.currentRoom = allWalls;
          this.subheaderWall = allWalls.walls;
          this.subheaderRoomName = allWalls.room_details.room_name;
            console.log(this.currentRoom)
        });
    exchangeService.changeHeaderViewEmitted.subscribe(
        flag => {
          this.headerFieldToggle = flag;
        })
  }

  ngOnInit() {
      this.currentRoom.membership = {};
    this.currentRoom.membership.member = 1;
    this.currentRoom.is_admin = true;

  }

  logOut(){
    this.requestService.logOut().subscribe(
        data=>{
          console.log(data);
            this.storeservice.deleteUserData();
            this.router.navigateByUrl('/login');
        },
        error => {
          this.error = error.json();
          console.log(this.error);
        }
    )
  }

    interractWithUser(flag: string):void {

       this.currentRoom.flag = flag;
          this.requestService.joinAndLeaveRoom(this.currentRoom).subscribe(
          data=>{
              this.currentRoom.membership.member = this.currentRoom.membership.member === 1 ? 0 : 1;
          },
          error => {
              this.error = error.json();
              console.log(this.error);
          }
      )
    }

}
