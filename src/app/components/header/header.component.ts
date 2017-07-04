import { Component, OnInit, HostListener, HostBinding} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

import {RequestService} from '../../services/request.service';
import {UserStoreService} from '../../services/user-store.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

import { Wall } from '../../commonClasses/wall';


@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit {

  error: any;

  room_search: string;
    showSuggestOrDefault: string;
    currentUser: any;
    message_notification_offset: number;
    messages: any[];
    messages_quantity: number;
    notifications: any[];
    notifications_quantity: number;
    routerSubscription: any;
    tree: any;
    for_active_class: boolean;
    hide_header: boolean;
    attendeds_links: string[];
    back_link: string;
    header_opener_mod: boolean;

    @HostListener('window:keydown', ['$event']) keyboardInput(event: KeyboardEvent) {

        event.keyCode === 13 && this.room_search && this.doRoomSearch(this.room_search)
    }

    @HostBinding('class') marginClass = '';

    constructor(private requestService : RequestService,
              private storeservice: UserStoreService,
              private exchangeService: EventsExchangeService,
              private router: Router) {}

  ngOnInit() {

        this.attendeds_links = ['all-rooms'];
      this.message_notification_offset = 0;
      this.messages = [];
      this.notifications = [];
      this.showSuggestOrDefault = 'suggested';
      this.messages_quantity = 0;
      this.notifications_quantity = 0;
      this.currentUser = this.storeservice.getUserData();
      this.getNewMessages();
      this.getNewNotifications();
      this.for_active_class = true;
      this.parseUrl();

      this.routerSubscription = this.router.events.subscribe(event=>{

          if (event instanceof NavigationEnd ){
              this.parseUrl()
          }
      })

      this.exchangeService.userAvatarChangedEvent.subscribe(
          message => {
              this.currentUser = this.storeservice.getUserData();
          });
  }


  parseUrl():void {

      let parses = this.router.parseUrl(this.router.url);
      this.tree = parses.root.children.primary.segments;
      this.changeLinkState(this.tree[0].path)
  }

  logOut(){

    this.requestService.logOut().subscribe(
        data=>{
            this.storeservice.deleteUserData();
            this.router.navigateByUrl('/login');
        },
        error => {
          this.error = error;
          console.log(this.error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t log out'})}
    )
  }


    showSuggestionsRoomsorDefault(flag: string): void {

      this.showSuggestOrDefault = flag;
      this.room_search = '';
      this.storeservice.deleteSearchText();

      this.storeservice.changeSuggestedOrDefault(flag);

      this.exchangeService.getSuggestRoomsOrUserRooms(flag)
    }

    // event go to all-rooms component, and request to server makes there
    doRoomSearch(request: string): void {

        let trimmed = request.trim();
        if (trimmed.length > 2 && trimmed !== this.storeservice.getSearchText()){
          this.showSuggestOrDefault = '';
          this.router.navigateByUrl('all-rooms');
          this.storeservice.saveSearchText(trimmed);
          this.exchangeService.searchByHeaderSearchField(trimmed)
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

    changeLinkState(path: any):void {

        // path != this.attendeds_links[this.attendeds_links.length - 1] && this.attendeds_links.push(path);

        path === 'all-rooms'  ? this.for_active_class = true : this.for_active_class = false;

        // if(path === 'room' || path === 'about-user' || path === 'user-settings'){
        //     this.hide_header = true;
        //     this.back_link = this.attendeds_links[this.attendeds_links.length - 2] || 'all-rooms';
        //
        // }else {
        //     this.hide_header = false;
        // }
    }

    // goBack():void {
    //
    //     this.router.navigateByUrl(this.back_link);
    // }

    addHeaderClass(flag: boolean):void {

      this.marginClass = flag ? 'opened': ''
    }

}
