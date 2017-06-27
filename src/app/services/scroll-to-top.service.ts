import { Injectable } from '@angular/core';

@Injectable()
export class ScrollToTopService {

  constructor() { }


  scrollMethod(element:any, to:any, duration:any):void {

    scrollTo(element, to, duration);

    function scrollTo(element, to, duration) {

      let timeout;

      if (duration <= 0){
        clearTimeout(timeout);
        return;
      } else {
        let difference = to - element.scrollTop;
        let perTick = difference / duration * 10;

        timeout = setTimeout(function () {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop == to){
            clearTimeout(timeout);
            return;
          }
          scrollTo(element, to, duration - 10);
        }, 10);
      }

    }
  }


}
