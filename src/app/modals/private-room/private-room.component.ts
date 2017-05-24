import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

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
              private requestService : RequestService) { }

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
            this.error = error.json();
            console.log(this.error);
          }
      )
    } else {
      this.closeModal()
    }
  }

  closeModal():void {
    this.activeModal.close();

  }

}
