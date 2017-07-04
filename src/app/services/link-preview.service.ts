import { Injectable } from '@angular/core';

@Injectable()
export class LinkPreviewService {

  constructor() { }

  makePreviews(messages: any[]):any {

    let allLinks = [];

    for (let i = 0; i < messages.length; i++){
      if (messages[i].text){
        let url = messages[i].text.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
        url ? messages[i]['url_previews'] = url : '';
      }
    }

  }

}
