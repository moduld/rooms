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
  // @HostListener('document:click' || 'document:touch', ['$event']) handleKeyboardEvent(event: any) {
  //   console.log(event)
  //   if (!event.target.classList.contains('drop_down_container')){
  //       let elems: any = document.body.getElementsByTagName("*");
  //         for (let i = 0; i < elems.length; i++){
  //           elems[i].classList.contains('dd_opened') ? elems[i].classList.remove('dd_opened') : ''
  //         }
  //
  //   }
  // }

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

f(event:Event){
    console.log(Event)
}

}
