import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {RequestService, EventsExchangeService, SafariErrorsFixService, TranslateAppService, RouterEventsListenerService } from './services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy{

  showHeader: boolean;
  routerChangeSubscription: any;

  constructor( private exchangeService: EventsExchangeService,
               private requestService : RequestService,
               private translateService: TranslateAppService,
               private safariService: SafariErrorsFixService,
               private routesListener: RouterEventsListenerService){

    translateService.runTranslation()
  }

  ngOnInit():void {

    this.requestService.addRequiredDataToTheService();
    this.safariService.addSafariClass();
    this.routesListener.routerEventsSubscribe()

    this.routerChangeSubscription = this.routesListener.routeChangedEvent.subscribe((data)=>{

      if (data.urlValue === '/registration' || data.urlValue === '/login' || data.urlValue === '/password-recovery'){
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }

      // need to close opened modals when url changed by click "back" button or else
      this.exchangeService.pushEventUrlChanged()
    });
  }

  ngOnDestroy() {

    this.routerChangeSubscription && this.routerChangeSubscription.unsubscribe()
  }


}
