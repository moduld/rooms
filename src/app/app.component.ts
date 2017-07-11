import { Component, ViewEncapsulation, OnInit, HostListener } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Router, NavigationEnd} from '@angular/router';
import {RequestService} from './services/request.service';
import { EventsExchangeService } from './services/events-exchange.service';
import { SafariErrorsFixService } from './services/safari-errors-fix.service';



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
               private requestService : RequestService,
                private safariService: SafariErrorsFixService){


    router.events.forEach((event) => {
      if (event instanceof NavigationEnd ){
        //registration and log-in pages have their oun footer and do not have header
        if (event.url === '/registration' || event.url === '/login'){
          this.showHeader = false;
        } else {
          this.showHeader = true;
        }
// need to close opened modals when url changed by click "back" button or else
        this.exchangeService.pushEventUrlChanged()
      }
    });

  }

  ngOnInit():void {

    this.requestService.addRequiredDataToTheService();
    this.safariService.addSafariClass()
  }



}
