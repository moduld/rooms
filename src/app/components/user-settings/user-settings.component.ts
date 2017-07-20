import { Component, OnInit } from '@angular/core';
import { EventsExchangeService } from '../../services/index';

@Component({
  selector: 'app-user-settings',
  templateUrl: 'user-settings.component.html',
  styleUrls: ['user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  menu_state_toggle: boolean;

  constructor( private exchangeService: EventsExchangeService) {

    exchangeService.urlChangedEvent.subscribe(
        () => {
          this.menu_state_toggle = false
        });
  }

  ngOnInit() {

    window.innerWidth > 550 ? this.menu_state_toggle = true : false;
  }

}
