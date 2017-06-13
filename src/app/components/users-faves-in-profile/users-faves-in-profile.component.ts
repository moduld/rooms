import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';

import { EventsExchangeService } from '../../services/events-exchange.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-users-faves-in-profile',
  templateUrl: 'users-faves-in-profile.component.html',
  styleUrls: ['users-faves-in-profile.component.scss']
})
export class UsersFavesInProfileComponent implements OnInit, OnDestroy {

  error: any;
  allUsers: any[];
  tree: any;
  user_id: any;
  users_offset: number;
  flagMoveY: boolean = true;
  show_loading: boolean;
  routerSubscription: any;

  constructor(private requestService: RequestService,
              private router: Router,
              private exchangeService: EventsExchangeService) { }

  ngOnInit() {

    this.users_offset = 0;
    this.allUsers = [];
    this.show_loading = true;

    this.routerSubscription = this.router.events.subscribe(event=>{

      if (event instanceof NavigationEnd ){
        let parses = this.router.parseUrl(this.router.url);
        this.tree = parses.root.children.primary.segments;
        this.user_id = this.tree[1].path;
        this.getUserFaves()
      }
    })

  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  getUserFaves():void {

    let dataToServer = {
      user_id: this.user_id,
      user_id_last: this.users_offset,
    };

    this.show_loading = true;

    this.requestService.getUsersFaves(dataToServer).subscribe(
        data=>{
          if (data['users'].length){
            this.allUsers = this.allUsers.concat(data['users']);
            this.flagMoveY = true;
          }
          this.show_loading = false;
        },
        error => {
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get users faves'})
        }
    );
  }

  unfaveUser(user: any, index: number): void {

    if (user.is_fave){

      let dataToServer = {
        user_id_fave: user.user_id,
        is_fave: user.is_fave
      };

      this.requestService.faveUnfaveUser(dataToServer).subscribe(
          data=>{
            this.allUsers.splice(index, 1);
            this.exchangeService.changeQuontityOfItemsInUserSettings('unfave')
          },
          error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t this action'})}
      )
    }
  }

  onScrollRichTheEnd(event): void {

    if (this.flagMoveY){
      this.users_offset = this.allUsers[this.allUsers.length - 1].user_id;
      this.flagMoveY = false;
      this.getUserFaves()
    }

  }

}
