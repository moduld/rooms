import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-users-rooms-in-profile',
  templateUrl: 'users-rooms-in-profile.component.html',
  styleUrls: ['users-rooms-in-profile.component.scss']
})
export class UsersRoomsInProfileComponent implements OnInit {

  error: any;
  user_id: any;
  tree: any;
  allRooms: any[];

  constructor(private requestService: RequestService,
              private router: Router) { }

  ngOnInit() {

    let parses = this.router.parseUrl(this.router.url);
    this.tree = parses.root.children.primary.segments;
    this.tree.length > 3 ? this.user_id = this.tree[2].path : this.user_id = this.tree[1].path;
    this.getUserRooms()
  }

  getUserRooms(): void {

    this.requestService.getOnlyUsersRooms(this.user_id).subscribe(
        data=>{
         console.log(data)
          this.allRooms = data;
        }, error => {this.error = error; console.log(error);}
    );
  }
}
