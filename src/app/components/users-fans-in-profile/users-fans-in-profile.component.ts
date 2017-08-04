import { Component, OnInit, OnDestroy} from '@angular/core';

import { EventsExchangeService, RequestService, UserStoreService, RouterEventsListenerService } from '../../services/index';

@Component({
  selector: 'app-users-fans-in-profile',
  templateUrl: 'users-fans-in-profile.component.html',
  styleUrls: ['users-fans-in-profile.component.scss']
})
export class UsersFansInProfileComponent implements OnInit, OnDestroy{

  error: any;
  allUsers: any[];
  user_id: any;
  users_offset: number;
  flagMoveY: boolean = true;
  show_loading: boolean;
    currentUser: any;
    routerChangeSubscription: any;

  constructor(private requestService: RequestService,
              private exchangeService: EventsExchangeService,
              private storeservice: UserStoreService,
              private routesListener: RouterEventsListenerService) {

      this.routerChangeSubscription = this.routesListener.routeChangedEvent.subscribe((data)=>{
          this.user_id = Number(data['segmentsArr'][1].path) / 22;
          this.getUserFans()
      });
  }

  ngOnInit() {

   this.users_offset = 0;
    this.allUsers = [];
    this.show_loading = true;
      this.currentUser = this.storeservice.getUserData();

      this.exchangeService.srcrooReachEndEvent.subscribe(()=>{

          if (this.flagMoveY){
              this.users_offset = this.allUsers[this.allUsers.length - 1].user_id;
              this.flagMoveY = false;
              this.getUserFans()
          }
      });
  }

    ngOnDestroy() {

        this.routerChangeSubscription && this.routerChangeSubscription.unsubscribe()
    }


  getUserFans():void {

    let dataToServer = {
      user_id: this.user_id,
      user_id_last: this.users_offset,
    };

    this.show_loading = true;

    this.requestService.getUsersFans(dataToServer).subscribe(
        data=>{
          if (data['users'].length){
            this.allUsers = this.allUsers.concat(data['users']);
            this.flagMoveY = true;
          }
          this.show_loading = false;
        },
        error => {
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get fans list'})
        }
    );
  }

    faveUnfaveUser(user: any): void {

      let dataToServer = {
        user_id_fave: user.user_id,
        is_fave: user.is_fave
      };

      this.requestService.faveUnfaveUser(dataToServer).subscribe(
          data=>{
              user.is_fave = !user.is_fave;
              if (this.user_id == this.currentUser.user_data.user_id){
                  user.is_fave ? this.exchangeService.changeQuontityOfItemsInUserSettings('fave') : this.exchangeService.changeQuontityOfItemsInUserSettings('unfave')
              }

          },
          error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
      )
  }

}
