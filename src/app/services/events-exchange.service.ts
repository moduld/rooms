import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventsExchangeService {

  constructor() { }


  private headerRoomSearch = new Subject<any>();
  private headerRoomSuggetsRooms = new Subject<any>();
  private dataChangedFromSettings = new Subject<any>();
  private showVisualMessageForUser = new Subject<any>();


  makeHeaderRoomSearch = this.headerRoomSearch.asObservable();
  makeHeaderRoomSuggestRequest = this.headerRoomSuggetsRooms.asObservable();
  dataChangedFromUserSettings = this.dataChangedFromSettings.asObservable();
  showMessageForUser = this.showVisualMessageForUser.asObservable();



  searchByHeaderSearchField(request: string): void {
    this.headerRoomSearch.next(request);
  }

  getSuggestRoomsOrUserRooms(flag: string): void {
    this.headerRoomSuggetsRooms.next(flag);
  }

  changeQuontityOfItemsInUserSettings(data: string): void {
    this.dataChangedFromSettings.next(data);
  }

  doShowVisualMessageForUser(data: any): void {
    this.showVisualMessageForUser.next(data);
  }

}
