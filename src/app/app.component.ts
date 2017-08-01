import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {RequestService, EventsExchangeService, SafariErrorsFixService, TranslateAppService } from './services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{

  showHeader: boolean;


  constructor( private router: Router,
               private exchangeService: EventsExchangeService,
               private requestService : RequestService,
               private translateService: TranslateAppService,
               private safariService: SafariErrorsFixService ){


    router.events.forEach((event) => {
      if (event instanceof NavigationEnd ){
        //registration and log-in pages have their oun footer and do not have header
        if (event.url === '/registration' || event.url === '/login' || event.url === '/password-recovery'){
          this.showHeader = false;
        } else {
          this.showHeader = true;
        }
// need to close opened modals when url changed by click "back" button or else
        this.exchangeService.pushEventUrlChanged()
      }
    });

    translateService.runTranslation()
  }

  ngOnInit():void {

    this.requestService.addRequiredDataToTheService();
    this.safariService.addSafariClass();
  }


}
