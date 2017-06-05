import { Component, OnInit } from '@angular/core';
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
  currentRoom: Wall;


  room_search: string;
  subheaderWall: any[] = [];
  subheaderRoomName: string = '';
  headerFieldToggle: boolean;
  showDropdownMenu: boolean;
  timeoute: any;
    showSuggestOrDefault: boolean;
    dontShowBoth: boolean;

  constructor(private requestService : RequestService,
              private storeservice: UserStoreService,
              private exchangeService: EventsExchangeService,
              private router: Router) {

    storeservice.roomChangedAsObservable.subscribe(
        room => {
          this.currentRoom = room;
            this.headerFieldToggle = false;
            this.showDropdownMenu = true;
        });

      router.events.forEach((event) => {
          if (event instanceof NavigationEnd ){
              if (event.url === '/' || event.url === '/all-rooms'){
                  this.headerFieldToggle = true;
              }
              if (event.url === '/room-settings' ){
                  this.headerFieldToggle = false;
                  this.showDropdownMenu = false;

              }

           event.url.indexOf('about-user') >= 0 ? this.dontShowBoth = false : this.dontShowBoth = true

          }
      });
  }

  ngOnInit() {

      this.dontShowBoth = true;
      this.headerFieldToggle = true;
      this.showDropdownMenu = true;
      this.showSuggestOrDefault = false;
      !this.storeservice.getStoredCurrentUserRooms() && this.router.navigateByUrl('/all-rooms');
  }

  logOut(){

    this.requestService.logOut().subscribe(
        data=>{
          console.log(data);
            this.storeservice.deleteUserData();
            this.router.navigateByUrl('/login');
        },
        error => {
          this.error = error.json();
          console.log(this.error);
        }
    )
  }

    interractWithUser(flag: string):void {

       this.currentRoom.flag = flag;
          this.requestService.joinAndLeaveRoom(this.currentRoom).subscribe(
          data=>{
              this.currentRoom.membership.member = this.currentRoom.membership.member === 1 ? 0 : 1;
          },
          error => {
              this.error = error.json();
              console.log(this.error);
          }
      )
    }

    showSuggestionsRoomsorDefault(): void {

      this.showSuggestOrDefault = !this.showSuggestOrDefault;
      if (!this.showSuggestOrDefault){
          this.room_search = '';
          this.storeservice.deleteSearchText();
      }
        this.storeservice.changeSuggestedOrDefault(this.showSuggestOrDefault);

        this.exchangeService.getSuggestRoomsOrUserRooms(this.showSuggestOrDefault)
    }

    // event go to all-rooms component, and request to server makes there
    doRoomSearch(request: string): void {

      clearTimeout(this.timeoute);
      this.timeoute = setTimeout(()=>{
          this.storeservice.saveSearchText(request);
          this.exchangeService.searchByHeaderSearchField(request)
      }, 1000);
    }

}
