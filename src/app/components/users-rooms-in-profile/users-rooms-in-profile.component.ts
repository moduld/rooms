import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router,  NavigationEnd} from '@angular/router';

import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-users-rooms-in-profile',
  templateUrl: 'users-rooms-in-profile.component.html',
  styleUrls: ['users-rooms-in-profile.component.scss']
})
export class UsersRoomsInProfileComponent implements OnInit, OnDestroy{

  error: any;
  user_id: any;
  tree: any;
  allRooms: any[];
  routerSubscription: any;

  constructor(
              private requestService: RequestService,
              private router: Router) { }

  ngOnInit() {

    this.routerSubscription = this.router.events.subscribe(event=>{

      if (event instanceof NavigationEnd ){
        let parses = this.router.parseUrl(this.router.url);
        this.tree = parses.root.children.primary.segments;
        this.user_id = this.tree[1].path;
        this.getUserRooms()
      }
    })

  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }


  getUserRooms(): void {


    this.requestService.getOnlyUsersRooms(this.user_id).subscribe(
        data=>{
          // console.log(data)
          this.allRooms = data['rooms'];
        }, error => {this.error = error; console.log(error);}
    );
  }
}
