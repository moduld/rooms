import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { EventsExchangeService } from '../../services/events-exchange.service';
import {RequestService} from '../../services/request.service';

@Component({
  selector: 'app-private-room',
  templateUrl: 'private-room.component.html',
  styleUrls: ['private-room.component.scss']
})
export class PrivateRoomComponent implements OnInit, Input {

  @Input() room_details;
  error: any;
  room_name: string;
  room_description: string;

  constructor(public activeModal: NgbActiveModal,
              private requestService : RequestService,
              private exchangeService: EventsExchangeService) {

    exchangeService.urlChangedEvent.subscribe(
        () => {
          this.activeModal.dismiss()
        });
  }

  ngOnInit() {

    this.room_name = this.room_details.room_name;
    this.room_description = this.room_details.room_desc;
    setTimeout(()=>{
      let modaldialog = document.querySelector('.modal-dialog');
      modaldialog.classList.add('modal_low_width')
    })
  }

  clickHandle(flag: boolean): void {

    if (flag){
      let dataToServer = {};
      dataToServer['room_details'] = this.room_details;
      dataToServer['flag'] = 'join';
      this.requestService.joinAndLeaveRoom(dataToServer).subscribe(
          (data)=>{
           this.closeModal()
          },
          error => {
            this.error = error;
            console.log(this.error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t make this action'})}
      )
    } else {
      this.closeModal()
    }
  }

  closeModal():void {
    this.activeModal.close();

  }

}
