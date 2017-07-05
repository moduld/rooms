import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LinkPreviewService {

  constructor(private requestService: RequestService) { }

  private getPrevienLink = new Subject<any>();
  getPrevienLinkEvent = this.getPrevienLink.asObservable();
  linksArchive = [];

  makePreviews(messages: any[]):void {

    let allLinks = [];

    for (let i = 0; i < messages.length; i++){
      if (messages[i].text){

        for (let t = 0; t < this.linksArchive.length; t++){
          if (messages[i].msg_id === this.linksArchive[t].message_id){
            this.getPrevienLink.next(this.linksArchive[t]);
            return
          }
              }

        let url = messages[i].text.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
        if (url){
          for (let j = 0; j < url.length; j++){
            allLinks.push({url: url[j], message_id: messages[i].msg_id});

          }
        }
      }
    }

    for (let k = 0; k < allLinks.length; k++){

      this.requestService.getLinkPreview(allLinks[k]).subscribe(data=>{
        this.getPrevienLink.next(data);
        this.linksArchive.push(data);
        for (let p = allLinks.length; p--; allLinks[p].message_id === data.message_id && allLinks.splice(p, 1)){}
      }, error=>{

      })
    }

  }

}
