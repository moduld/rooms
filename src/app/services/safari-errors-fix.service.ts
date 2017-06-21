import { Injectable } from '@angular/core';
import { EventsExchangeService } from './events-exchange.service';
import { Ng2DeviceService } from 'ng2-device-detector';

@Injectable()
export class SafariErrorsFixService {

  deviceInfo: any;

  constructor(private exchangeService: EventsExchangeService,
              private deviceService: Ng2DeviceService) {

    exchangeService.urlChangedEvent.subscribe(
        () => {
          this.addSafariClass()
        });
  }


  addSafariClass() {

    if (!this.deviceInfo){
      this.deviceInfo = this.deviceService.getDeviceInfo();
    }
    let timeout = setTimeout(()=>{
      let elems = document.body.getElementsByTagName("*");
      if (this.deviceInfo.browser === 'safari'){
        for (let i = 0; i < elems.length; i++){
          !elems[i].classList.contains('safari_browser') && elems[i].classList.add('safari_browser')
        }
      }
      clearTimeout(timeout)
    },0)

  }

}
