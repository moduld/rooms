import { Component } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Router, NavigationEnd} from '@angular/router';

import { EventsExchangeService } from './services/events-exchange.service';

import { Wall } from './commonClasses/wall';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private subscription: Subscription;
  hideSubheader: boolean;
  subheaderWall: any[] = [];
  subheaderRoomName: string = '';
  showHeader: boolean = true;
  showFooter: boolean = true;

  constructor( private router: Router, private exchangeService: EventsExchangeService){

    router.events.forEach((event) => {
      if (event instanceof NavigationEnd ){
        event.url === '/' ? this.hideSubheader = false :  this.hideSubheader = true;

        if (event.url === '/registration' || event.url === '/login'){
          this.showHeader = false;
          this.showFooter = false;
        }
      }
    });

  }
}
