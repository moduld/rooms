import { Injectable } from '@angular/core';

import { Wall } from '../commonClasses/wall';
import { UserInfo } from '../commonClasses/userInfo';

@Injectable()
export class UserStoreService {

  currentUserRooms: Wall;

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
  }

  getStoredCurrentUserRooms(): Wall {
    return this.currentUserRooms;
  }

}
