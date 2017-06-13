import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Router, NavigationEnd} from '@angular/router';
import {RequestService} from './services/request.service';
import { EventsExchangeService } from './services/events-exchange.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{

  showHeader: boolean;
  showFooter: boolean;

  constructor( private router: Router,
               private exchangeService: EventsExchangeService,
               private requestService : RequestService){

    router.events.forEach((event) => {
      if (event instanceof NavigationEnd ){

        if (event.url === '/registration' || event.url === '/login'){
          this.showHeader = false;
          this.showFooter = false;
        } else {
          this.showHeader = true;
          this.showFooter = true;
        }
      }
    });

  }

  ngOnInit():void {

    this.requestService.addRequiredDataToTheService()
  }

}
