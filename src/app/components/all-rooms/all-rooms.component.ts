import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';
import { AddRequiredInfoService } from '../../services/add-required-info.service';
import {UserStoreService} from '../../services/user-store.service';

import { Room } from '../../commonClasses/room';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {CreateRoomComponent} from '../../modals/create-room/create-room.component';


@Component({
  selector: 'app-all-rooms',
  templateUrl: 'all-rooms.component.html',
  styleUrls: ['all-rooms.component.scss']
})
export class AllRoomsComponent implements OnInit {

    error: any;
    allRooms: Room[] = [];
    constructor(private requestService: RequestService,
                private modalService: NgbModal,
                private exchangeService: EventsExchangeService,
                private addRequiredInfo: AddRequiredInfoService,
                private storeservice: UserStoreService) {

      exchangeService.makeHeaderRoomSearch.subscribe(
          search => {
              this.getSearchableRooms(search)
          });

        exchangeService.makeHeaderRoomSuggestRequest.subscribe(
            (flag) => {
                    flag ? this.getSuggestedRooms() : this.getUserRooms()
            })
  }

  ngOnInit() {

        if (this.storeservice.getSearchText()){
            this.getSearchableRooms(this.storeservice.getSearchText())
        } else {
            if (this.storeservice.getSuggestedOrDefault()){
                this.getSuggestedRooms()
            } else {
                this.getUserRooms()
            }
        }
  }

  getUserRooms(): void {

      this.requestService.getAllRooms().subscribe(
          data=>{
              for(let i = 0; i < data.length; i++){
                  if (!data[i].room){
                      data.splice(i, 1)
                  }
              }
              this.allRooms = data;
          }, error => {this.error = error; console.log(error);}
      );
  }

  getSearchableRooms(search: string): void {

      this.requestService.getRoomsBySearch(search).subscribe(
          data=>{
              this.allRooms = this.addRequiredInfo.addInfo(data)
          }, error => {this.error = error; console.log(error);}
      );
  }

  getSuggestedRooms():void {

      this.requestService.getSuggestionRooms().subscribe(
          data=>{
              this.allRooms = this.addRequiredInfo.addInfo(data)
          }, error => {this.error = error; console.log(error);}
      );
  }

    openNewRoomModal():void {

        const modalRef = this.modalService.open(CreateRoomComponent);
        modalRef.result.then((newRoom) => {
            this.allRooms.unshift(newRoom)
        });
    }

}
