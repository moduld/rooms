import { Component, OnInit, OnDestroy} from '@angular/core';

import { RequestService, EventsExchangeService, RouterEventsListenerService } from '../../services/index';

@Component({
  selector: 'app-users-rooms-in-profile',
  templateUrl: 'users-rooms-in-profile.component.html',
  styleUrls: ['users-rooms-in-profile.component.scss']
})
export class UsersRoomsInProfileComponent implements OnInit, OnDestroy{

  error: any;
  user_id: any;
  allRooms: any[];
  show_loading: boolean;
  routerChangeSubscription: any;

  constructor( private requestService: RequestService,
              private exchangeService: EventsExchangeService,
              private routesListener: RouterEventsListenerService) {

    this.routerChangeSubscription = this.routesListener.routeChangedEvent.subscribe((data)=>{
      this.user_id = Number(data.segmentsArr[1].path) / 22;
      this.getUserRooms()
    });
  }

  ngOnInit() {

    this.show_loading = false;
  }

  ngOnDestroy() {

    this.routerChangeSubscription && this.routerChangeSubscription.unsubscribe()
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
