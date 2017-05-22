import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';

import {UserStoreService} from '../../services/user-store.service';

import { UserInfo } from '../../commonClasses/userInfo';
import { Wall } from '../../commonClasses/wall';


@Component({
  selector: 'app-members-list',
  templateUrl: 'members-list.component.html',
  styleUrls: ['members-list.component.scss']
})
export class MembersListComponent implements OnInit {

  error: any;
  currentUserData: UserInfo;
  currentRoom: Wall;
  member_toggler: string;
  users: any[];

  constructor(private requestService: RequestService,
              private storeservice: UserStoreService) { }

  ngOnInit() {
    this.currentUserData = this.storeservice.getUserData();
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    this.member_toggler = 'member';
    this.users = [];
    this.makeRequest();
    console.log(this.currentRoom)

  }

  memberTypeChanged(value: string):void {

    this.member_toggler = value;
    this.makeRequest();
  }

  makeRequest(): void {

    this.requestService.getRoomMembers(this.member_toggler).subscribe(
        data=>{
          console.log(data)
          this.users = data['users'];
        },
        error => {this.error = error; console.log(error);}
    );
  }

}
