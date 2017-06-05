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
  offset: number;
  flagMoveY: boolean = true;
  show_loading: boolean;

  constructor(private requestService: RequestService,
              private storeservice: UserStoreService) { }

  ngOnInit() {
    this.currentUserData = this.storeservice.getUserData();
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    this.member_toggler = 'requester';
    this.users = [];
    this.offset = 0;
    this.show_loading = true;
    this.getRoomUsers();
    this.isAdmin();
  }

  isAdmin():void {
    this.membership = this.storeservice.getStoredCurrentUserRooms().membership;
    this.membership['admin'] || this.membership['moderator'] || this.membership['supermoderator'] ? this.membership['is_admin'] = true : this.membership['is_admin'] = false;
  }

  memberTypeChanged(value: string):void {

    this.member_toggler = value;
    this.users = [];
      this.flagMoveY = false;
      this.offset = 0;

    this.getRoomUsers();
  }

  getRoomUsers(): void {

      let dataToServer = {
          member_type: this.member_toggler,
          user_id_last: this.offset
      };

      this.show_loading = true;

    this.requestService.getRoomMembers(dataToServer).subscribe(
        data=>{
            if (data['users'].length){
                this.users = this.users.concat(data['users']);
                this.flagMoveY = true;
            }
            this.show_loading = false;
        },
        error => {this.error = error; console.log(error);}
    );
  }

  updateMembers(user: any, memb_type: string, flag: boolean, index: number): void {

    let data = {};
    data['membership_type'] = memb_type;
      memb_type === 'requester' ? data['membership_type'] = 'member' : '';
    data['room_id'] = user.room_id;
    data['user_id_member'] = user.user.user_id;
    data['member_type_val'] = flag ? 1 : 0;
    this.makeRequest(data, index)

  }

  makeRequest(data: any, index?: number): void {

    this.requestService.updateMembership(data).subscribe(
        data=>{
           index != undefined ? this.users.splice(index, 1) : this.users = []
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
        if(this.membership.supermoderator || this.membership.admin){
          returned = 'cross'
        }
      }

      if (this.member_toggler === 'supermoderator'){
        if(this.membership.admin){
          returned = 'cross'
        }
      }

      if (this.member_toggler === 'requester'){
        if(this.membership.admin || this.membership.supermoderator || this.membership.moderator){
          returned = 'check'
        }
      }

      if (this.member_toggler === 'talker'){
          if(this.membership.admin || this.membership.supermoderator || this.membership.moderator){
              returned = 'cross'
          }
      }

      return returned
  }

  forAllUsers(flag: string, value : number): void {

    let data = {};
    data['membership_type'] = flag;
    data['room_id'] = this.currentRoom.room_details['room_id'];
    data['user_id_member'] = 0;
    data['member_type_val'] = value;
    this.makeRequest(data)
  }

    onScrollRichTheEnd(event): void {

        if (this.flagMoveY){
            this.offset = this.users[this.users.length - 1].user_id;
            this.flagMoveY = false;
            this.getRoomUsers()
        }

    }

}
