import { Injectable } from '@angular/core';

@Injectable()
export class OpenNewWindowService {

  constructor() { }

  openImageLink(content: any):void {

    let newWidth = Math.round(window.innerWidth * 0.75);
    let newHeight = Math.round(window.innerHeight * 0.75);
    let leftPosition = Math.round(window.innerHeight * 0.125);
    let topPosition = Math.round(window.innerHeight * 0.125);
    let concat = 'width=' + newWidth + ',' + 'height=' + newHeight + ',' + 'left=' + leftPosition + ',' + 'top=' + topPosition;
    window.open(content.multimedia, "fullscreen=no",  concat)
  }

}
