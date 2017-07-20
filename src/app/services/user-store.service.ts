import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserStoreService {

  currentUserRooms: any;
  searchRequest: string;

  private roomChanged = new Subject<any>();

  constructor() { }

  setLanguage(lang: any):void {

    localStorage.setItem('tifo-user-lang', JSON.stringify(lang))
  }

  getLanguages(): any {

    return localStorage.getItem('tifo-user-lang') && JSON.parse(localStorage.getItem('tifo-user-lang')) || ''
  }

  getUserData ():any {
    return localStorage.getItem('tifo-user-data') && JSON.parse(localStorage.getItem('tifo-user-data')) || ''
  }

  saveUserData (user_data: any): void {
    localStorage.setItem('tifo-user-data', JSON.stringify(user_data))
  }

  deleteUserData (): void {
    localStorage.removeItem('tifo-user-data')
  }

  storeCurrentUserRooms(data: any): void {
    this.currentUserRooms = data;
    this.roomChanged.next(data);
  }

  getStoredCurrentUserRooms(): any {
    return  this.currentUserRooms
  }


  getSearchText(): string {
    return this.searchRequest
  }

}
