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
  membership: any;
  search_model: string;

  constructor(private requestService: RequestService,
              private storeservice: UserStoreService) { }

  ngOnInit() {
    this.currentUserData = this.storeservice.getUserData();
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    this.member_toggler = 'member';
    this.users = [];
    this.getRoomUsers();
    this.isAdmin();
    console.log(this.membership)
  }

  isAdmin():void {
    this.membership = this.storeservice.getStoredCurrentUserRooms().membership;
    this.membership['admin'] || this.membership['moderator'] || this.membership['supermoderator'] ? this.membership['is_admin'] = true : this.membership['is_admin'] = false;
  }

  memberTypeChanged(value: string):void {

    this.member_toggler = value;
    this.users = [];
    this.getRoomUsers();
  }

  getRoomUsers(): void {

    this.requestService.getRoomMembers(this.member_toggler).subscribe(
        data=>{
          console.log(data)
          this.users = data['users'];
        },
        error => {this.error = error; console.log(error);}
    );
  }

  updateMembers(user: any, memb_type: string, flag: boolean): void {

    let data = {};
    data['membership_type'] = memb_type;
    data['room_id'] = user.room_id;
    data['user_id_member'] = user.user.user_id;
    data['member_type_val'] = flag ? 1 : 0;
    this.makeRequest(data)

  }

  makeRequest(data: any): void {

    this.requestService.updateMembership(data).subscribe(
        data=>{
          console.log(data)

        },
        error => {this.error = error; console.log(error);}
    );
  }

  showUserMembershipMenu(user: any): string {

      let returned = '';

      if (this.member_toggler === 'member'){
        returned = 'menu'
      }


      if (this.member_toggler === 'admin'){
        returned = ''
      }

      if (this.member_toggler === 'moderator'){
        if(user.supermoderator || user.admin){
          returned = 'cross'
        }
      }

      if (this.member_toggler === 'supermoderator'){
        if(user.admin){
          returned = 'cross'
        }
      }

      if (this.member_toggler === 'requester'){
        if(user.admin || user.supermoderator || user.moderator){
          returned = 'check'
        }
      }

      return returned
  }

  forAllUsers(flag: string, value : number): void {

    let data = {};
    data['membership_type'] = flag;
    data['room_id'] = this.currentRoom['room_id'];
    data['user_id_member'] = 0;
    data['member_type_val'] = value;
    this.makeRequest(data)
  }

}
