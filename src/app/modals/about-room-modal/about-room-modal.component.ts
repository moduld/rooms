import { Component, OnInit, Input} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { EventsExchangeService } from '../../services/index';

@Component({
  selector: 'app-about-room-modal',
  templateUrl: './about-room-modal.component.html',
  styleUrls: ['./about-room-modal.component.scss']
})
export class AboutRoomModalComponent implements OnInit{

  @Input() room_details;

  constructor(public activeModal: NgbActiveModal,
              private exchangeService: EventsExchangeService,
              private modalService: NgbModal) {

    exchangeService.urlChangedEvent.subscribe(
        () => {
          this.activeModal.dismiss()
        });
  }

  ngOnInit() {
  }





}
