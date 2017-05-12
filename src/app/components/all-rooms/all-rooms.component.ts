import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

import { Room } from '../../commonClasses/room';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {CreateRoomComponent} from '../../modals/create-room/create-room.component';


@Component({
  selector: 'app-all-rooms',
  templateUrl: 'all-rooms.component.html',
  styleUrls: ['all-rooms.component.css']
})
export class AllRoomsComponent implements OnInit {

  constructor(private requestService: RequestService,
              private eventsExchange: EventsExchangeService,
              private modalService: NgbModal) { }
  error: any;
  allRooms: Room[] = [];

  ngOnInit() {

      this.allRooms = this.eventsExchange.allRoomsChached;

      this.requestService.getAllRooms().subscribe(
          data=>{
            console.log(data);
            this.allRooms = data;
            // this.eventsExchange.allRoomsChached = data
          }, error => {this.error = error; console.log(error);}
      );


      this.eventsExchange.changeHeaderView(true);
  }

    openNewRoomModal():void {

        const modalRef = this.modalService.open(CreateRoomComponent);
        modalRef.result.then((newRoom) => {
            console.log(newRoom)
            this.allRooms.unshift(newRoom)
        });
    }
}
