import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventsExchangeService {

  constructor() { }


  private headerRoomSearch = new Subject<any>();
  private headerRoomSuggetsRooms = new Subject<any>();
  private dataChangedFromSettings = new Subject<any>();
  private showVisualMessageForUser = new Subject<any>();
  private urlChanged = new Subject<any>();


  makeHeaderRoomSearch = this.headerRoomSearch.asObservable();
  makeHeaderRoomSuggestRequest = this.headerRoomSuggetsRooms.asObservable();
  dataChangedFromUserSettings = this.dataChangedFromSettings.asObservable();
  showMessageForUser = this.showVisualMessageForUser.asObservable();
  urlChangedEvent = this.urlChanged.asObservable();


  //event when user clicks search icon in search field in the header.
  //calls in header.component. used in allRooms.component
  searchByHeaderSearchField(request: string): void {
    this.headerRoomSearch.next(request);
  }
//event when user clicks suggested or my Tifos in the header.
//calls in header.component. used in allRooms.component
  getSuggestRoomsOrUserRooms(flag: string): void {
    this.headerRoomSuggetsRooms.next(flag);
  }
  //to increase or decrease value inside buttons (switchers between user rooms, posts, favs, fans)
  //calls from UserPostsInProfile, UserFansInProfile, UserFavesInProfile. used in AboutUser.component
  changeQuontityOfItemsInUserSettings(data: string): void {
    this.dataChangedFromSettings.next(data);
  }
  //calls from each component witch has requests to server, or required visible notification to user.
  //used in showVisualMessage component
  doShowVisualMessageForUser(data: any): void {
    this.showVisualMessageForUser.next(data);
  }
  //calls from app.component when url changed. need to close modals. used in all modals components
  pushEventUrlChanged(): void {
    this.urlChanged.next();
  }

}
