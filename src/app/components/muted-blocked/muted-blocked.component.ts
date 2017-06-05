import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-muted-blocked',
  templateUrl: 'muted-blocked.component.html',
  styleUrls: ['muted-blocked.component.scss']
})
export class MutedBlockedComponent implements OnInit {

  member_toggler: string;
  error: any;
  offset: number;
  users: any[];
  flagMoveY: boolean = true;
  show_loading: boolean;

  constructor( private requestService: RequestService) { }

  ngOnInit() {
    this.member_toggler = 'muted';
    this.offset = 0;
    this.users = [];
    this.show_loading = true;
    this.getTheList()
  }

  memberTypeChanged(state: string): void {

    this.flagMoveY = false;
    this.member_toggler = state;
    this.users = [];
    this.offset = 0;

    this.getTheList()
  }

  getTheList():void {

    let  dataToServer = {
      user_id_last: this.offset,
      flag: this.member_toggler
    };

    this.show_loading = true;

    this.requestService.getMutedOrBlockedUsersList(dataToServer).subscribe(
        data=>{
          if (data['users'].length){
            this.users = this.users.concat(data['users']);
            this.flagMoveY = true;
          }
          this.show_loading = false;
        },
        error => {this.error = error; console.log(error);}
    )
  }

  removeUserFromList(user, index):void {

    let dataToServer = {
      user_interract_key: this.member_toggler === 'muted' ? 'mute' : 'block',
      user_interract_id: user.user_id,
      flag: 0
    };

    this.requestService.blockOrMuteUser(dataToServer).subscribe(
        data=>{
          this.users.splice(index, 1)
        },
        error => {this.error = error; console.log(error);}
    )
  }

  onScrollRichTheEnd(event): void {

    if (this.flagMoveY){
      this.offset = this.users[this.users.length - 1].user_id;
      this.flagMoveY = false;
      this.getTheList()
    }

  }

}
