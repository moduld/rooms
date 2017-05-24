import { Injectable } from '@angular/core';

import { Wall } from '../commonClasses/wall';
import { UserInfo } from '../commonClasses/userInfo';

import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserStoreService {

  currentUserRooms: Wall;
  searchRequest: string;
  suggestedRoomsShow: boolean;

  private roomChanged = new Subject<any>();
  roomChangedAsObservable = this.roomChanged.asObservable();

  constructor() { }

  getUserData ():UserInfo {
    return localStorage.getItem('tifo-user-data') && JSON.parse(localStorage.getItem('tifo-user-data')) || ''
  }

  saveUserData (user_data: any): void {
    localStorage.setItem('tifo-user-data', JSON.stringify(user_data))
  }

  deleteUserData (): void {
    localStorage.removeItem('tifo-user-data')
  }

  storeCurrentUserRooms(data: Wall): void {
    this.currentUserRooms = data;
    this.roomChanged.next(data);
  }

  getStoredCurrentUserRooms(): Wall {
    return  this.currentUserRooms
  }

  saveSearchText(text: string): void {
    this.searchRequest = text;
  }

  getSearchText(): string {
    return this.searchRequest
  }

  deleteSearchText(): void {
    this.searchRequest = ''
  }

  changeSuggestedOrDefault(flag: boolean): void {
    this.suggestedRoomsShow = flag;
  }

  getSuggestedOrDefault(): boolean {
    return this.suggestedRoomsShow
  }


}
