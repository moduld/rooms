import { Component, OnInit } from '@angular/core';
import { EventsExchangeService } from '../../services/index';


@Component({
  selector: 'app-show-visual-messages',
  templateUrl: './show-visual-messages.component.html',
  styleUrls: ['./show-visual-messages.component.scss']
})
export class ShowVisualMessagesComponent implements OnInit {


  message: string;
  flag: boolean;
  show_message: boolean;

  constructor( private exchangeService: EventsExchangeService) {

    exchangeService.showMessageForUser.subscribe(
        message => {
          this.handleData(message)
        });
  }

  ngOnInit() {
    this.message = '';
  }

  handleData(message: any):void {

    this.flag = message.success;
    this.message = message.message;
    this.show_message = true;

    let timeout = setTimeout(()=>{

      this.show_message = false;
      clearTimeout(timeout)
    }, 2000)
  }

}
