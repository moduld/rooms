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
  subheaderWall: any[] = [];
  subheaderRoomName: string = '';
  headerFieldToggle: boolean;

  constructor(private requestService : RequestService,  private storeservice: UserStoreService,  private exchangeService: EventsExchangeService, private router: Router) {

    exchangeService.changeEmitted.subscribe(
        allWalls => {
          this.subheaderWall = allWalls.walls;
          this.subheaderRoomName = allWalls.room_details.room_name;
        });
    exchangeService.changeHeaderViewEmitted.subscribe(
        flag => {
          this.headerFieldToggle = flag;
        })
  }

  ngOnInit() {

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



}
