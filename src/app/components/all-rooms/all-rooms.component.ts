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
                    flag === 'suggested' ? this.getSuggestedRooms() : this.getUserRooms()
            })
  }

  ngOnInit() {
        //if default rooms output was changed to search or my rooms, and then user went to another page
        //when he comes to all-rooms page, this check returns previous state(search or my rooms)
        if (this.storeservice.getSearchText()){
            this.getSearchableRooms(this.storeservice.getSearchText())
        } else {
            this.storeservice.getSuggestedOrDefault() === 'suggested' && this.getSuggestedRooms();
            this.storeservice.getSuggestedOrDefault() === 'default' && this.getUserRooms();
            !this.storeservice.getSuggestedOrDefault() && this.getSuggestedRooms()
        }
  }

  getUserRooms(): void {

      this.requestService.getAllRooms().subscribe(
          data=>{
              //this cycle need to remove broken items which can come from server
              for(let i = 0; i < data.length; i++){
                  if (!data[i].room){
                      data.splice(i, 1)
                  }
              }
              this.allRooms = data['rooms'];
          }, error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get rooms your from a server'})}
      );
  }

  getSearchableRooms(search: string): void {

      this.requestService.getRoomsBySearch(search).subscribe(
          data=>{
              //server output items by search and suggest, have different structure from user rooms.
              // addRequiredInfo service used to bring structure to same format
              this.allRooms = this.addRequiredInfo.addInfo(data['rooms'])
          }, error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get searchable rooms from a server'})}
      );
  }

  getSuggestedRooms():void {

      this.requestService.getSuggestionRooms().subscribe(
          data=>{
              //server output items by search and suggest, have different structure from user rooms.
              // addRequiredInfo service used to bring structure to same format
              this.allRooms = this.addRequiredInfo.addInfo(data['rooms'])
          }, error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get suggested rooms from a server'})}
      );
  }

    openNewRoomModal():void {

        const modalRef = this.modalService.open(CreateRoomComponent);
        modalRef.result.then((newRoom) => {
            this.allRooms.unshift(newRoom)
        }).catch(()=>{});
    }

}
