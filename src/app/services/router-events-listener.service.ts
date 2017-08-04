import { Injectable } from '@angular/core';
import { Router, NavigationEnd, UrlSegmentGroup, UrlTree, PRIMARY_OUTLET, UrlSegment } from '@angular/router';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RouterEventsListenerService {

  routerSubscription: any;
  private routeChanged = new Subject<any>();
  routeChangedEvent = this.routeChanged.asObservable();

  constructor(private router: Router) { }

  routerEventsSubscribe():void {

    this.routerSubscription = this.router.events.subscribe(event=>{

      if (event instanceof NavigationEnd ){
        let parses: UrlTree = this.router.parseUrl(this.router.url);
        let segmentGroup: UrlSegmentGroup = parses.root.children[PRIMARY_OUTLET];
        let segments: UrlSegment[] = segmentGroup.segments;

        this.routeChanged.next({segmentGroup: segmentGroup, segmentsArr: segments, urlValue: event.url})
      }
    })
  }

}
