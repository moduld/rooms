import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, NavigationEnd, UrlSegmentGroup, UrlTree, PRIMARY_OUTLET, UrlSegment } from '@angular/router';

import { RequestService, EventsExchangeService } from '../../services/index';

@Component({
  selector: 'app-users-rooms-in-profile',
  templateUrl: 'users-rooms-in-profile.component.html',
  styleUrls: ['users-rooms-in-profile.component.scss']
})
export class UsersRoomsInProfileComponent implements OnInit, OnDestroy{

  error: any;
  user_id: any;
  allRooms: any[];
  routerSubscription: any;
  show_loading: boolean;

  constructor(
              private requestService: RequestService,
              private router: Router,
              private exchangeService: EventsExchangeService) {

    this.routerSubscription = this.router.events.subscribe(event=>{

      if (event instanceof NavigationEnd ){
        let parses: UrlTree = this.router.parseUrl(this.router.url);
        let segmentGroup: UrlSegmentGroup = parses.root.children[PRIMARY_OUTLET];
        let segments: UrlSegment[] = segmentGroup.segments;
        this.user_id = Number(segments[1].path) / 22;
        this.getUserRooms()
      }
    })
  }

  ngOnInit() {

    this.show_loading = false;
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }


  getUserRooms(): void {

    this.show_loading = true;
    this.requestService.getOnlyUsersRooms(this.user_id).subscribe(
        data=>{
          this.show_loading = false;
          this.allRooms = data['rooms'];
        }, error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get users rooms'})}
    );
  }
}
