import { Component, OnInit, HostListener, HostBinding} from '@angular/core';
import { Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';

import {RequestService, UserStoreService, EventsExchangeService} from '../../services/index';


@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit {

  error: any;

  room_search: string;
    currentUser: any;
    message_notification_offset: number;
    messages: any[];
    messages_quantity: number;
    notifications: any[];
    notifications_quantity: number;
    header_opener_mod: boolean;

    @HostListener('window:keydown', ['$event']) keyboardInput(event: KeyboardEvent) {

        event.keyCode === 13 && this.room_search && this.doRoomSearch(this.room_search)
    }

    @HostBinding('class') marginClass = '';

    constructor(private requestService : RequestService,
              private storeservice: UserStoreService,
              private exchangeService: EventsExchangeService,
              private translate: TranslateService,
              private router: Router) {


    }

  ngOnInit() {

      this.message_notification_offset = 0;
      this.messages = [];
      this.notifications = [];
      this.messages_quantity = 0;
      this.notifications_quantity = 0;
      this.currentUser = this.storeservice.getUserData();
      if (this.currentUser.token !== 'guest'){
          this.getNewMessages();
          this.getNewNotifications();
      }

      this.exchangeService.userAvatarChangedEvent.subscribe(
          message => {
              this.currentUser = this.storeservice.getUserData();
          });
  }

  logOut(){

    this.requestService.logOut().subscribe(
        data=>{
            this.currentUser = this.storeservice.getUserData();
            this.router.navigateByUrl('/explore');
        },
        error => {
          this.error = error;
          console.log(this.error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t log out'})}
    )
  }

    // event go to all-rooms component, and request to server makes there
    doRoomSearch(request: string): void {

      if (request){
          let trimmed = request.trim();
          if (trimmed.length > 2 && trimmed !== this.storeservice.getSearchText()){
              this.room_search = '';
              this.router.navigate( ['search', {q: trimmed}]);
          }
      }
    }

    getNewNotifications():void {

      let dataToServer = {
          type: 'All',
          offset_id: this.message_notification_offset,
          direction_flag: 0,
          'new': 1
      };

        this.requestService.getUserNotifications(dataToServer).subscribe(
            data=>{
                if (data && data['notifications'].length){

                    data['notifications'].length > 5 ? data['notifications'].length = 5 : '';
                    this.notifications = data['notifications'];
                }
                this.notifications_quantity = data['notifications_counts'].Total_All
            },
            error => {
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get new notifications from a server'})
            }
        )
    }

    getNewMessages(): void {

        this.requestService.getUserDialogUsersList().subscribe(
            data=>{
                if (data && data['messages'].length){
                    data['messages'] = data['messages'].filter((message)=>{
                        return message.new_flag && message.user_id !== this.currentUser.user_data.user_id
                    });
                    this.messages_quantity = data['messages'].length;
                    data['messages'].length > 5 ? data['messages'].length = 5 : '';
                    this.messages = data['messages'];
                }
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get new messages from a server'})}
        );

        this.requestService.getNotificationSettings().subscribe(
            data=>{

            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get new messages from a server'})}
        );
    }

    goToDialogPage(user: any):void {

        this.router.navigate( ['user-dialogs', {user: user.user.user_id*22}])
    }

    addHeaderClass(flag: boolean):void {

      this.marginClass = flag ? 'opened': ''
    }


}
