import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

import { Room } from '../../commonClasses/room';


@Component({
  selector: 'app-all-rooms',
  templateUrl: 'all-rooms.component.html',
  styleUrls: ['all-rooms.component.css']
})
export class AllRoomsComponent implements OnInit {

  constructor(private requestService: RequestService, private eventsExchange: EventsExchangeService) { }
  error: any;
  allRooms: Room[] = [];

  ngOnInit() {
    if (this.eventsExchange.allRoomsChached.length){
      this.allRooms = this.eventsExchange.allRoomsChached
    } else {
      this.requestService.getAllRooms().subscribe(
          data=>{
            console.log(data);
            this.allRooms = data;
            this.eventsExchange.allRoomsChached = data
          }, error => {this.error = error; console.log(error);}
      )
    }

      this.eventsExchange.changeHeaderView(true);
  }
}
