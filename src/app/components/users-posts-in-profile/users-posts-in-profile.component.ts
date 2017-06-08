import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { RequestService } from '../../services/request.service';
import {UserStoreService} from '../../services/user-store.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

import {PostDetailsComponent} from '../../modals/post-details/post-details.component';
import { UserInfo } from '../../commonClasses/userInfo';

@Component({
  selector: 'app-users-posts-in-profile',
  templateUrl: 'users-posts-in-profile.component.html',
  styleUrls: ['users-posts-in-profile.component.scss']
})
export class UsersPostsInProfileComponent implements OnInit, OnDestroy {

  error: any;
  allPosts: any[];
  tree: any;
  user_id: any;
  post_offset: number;
  currentUserData: UserInfo;
  wallsArray: any;
  userArmin: boolean;
  flagMoveY: boolean = true;
  show_loading: boolean;
    routerSubscription: any;

  constructor(private storeservice: UserStoreService,
              private requestService: RequestService,
              private router: Router,
              private modalService: NgbModal,
              private exchangeService: EventsExchangeService) { }

  ngOnInit() {
    this.currentUserData = this.storeservice.getUserData();
    this.allPosts = [];
    this.post_offset = 0;
    this.show_loading = false;

      this.routerSubscription = this.router.events.subscribe(event=>{

          if (event instanceof NavigationEnd ){
              let parses = this.router.parseUrl(this.router.url);
              this.tree = parses.root.children.primary.segments;
              this.user_id = this.tree[1].path;
              this.getUserPosts()
          }
      })
  }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

  getUserPosts():void {

    let dataToServer = {
      user_id_post: this.user_id,
      offset_id: this.post_offset,
      direction_flag: '0'
    };

    this.show_loading = true;

    this.requestService.getOnlyUsersPosts(dataToServer).subscribe(
        data=>{
          if (data['posts'].length){
            this.allPosts = this.allPosts.concat(data['posts']);
            this.flagMoveY = true;
          }
          this.show_loading = false;
        },
        error => {
          console.log(error)
        }
    );
  }

  openPostDetailsModal(post: any):void {

    this.requestService.getWalls(post.room_id).subscribe(
        data=>{
          if (data && data['message'] === undefined){
            this.wallsArray = data['room_walls'];
            this.isAdmin();
            this.wallsArray['is_admin'] = this.userArmin;
            this.openModal(post)
          }
        },
        error => {
          this.error = error.json();
        }
    );
  }

  isAdmin():void {

    this.wallsArray.membership['admin'] || this.wallsArray.membership['moderator'] || this.wallsArray.membership['supermoderator'] ? this.userArmin = true : this.userArmin = false;
  }

  openModal(post: any):void {

    const modalRef = this.modalService.open(PostDetailsComponent);
    modalRef.componentInstance.post = post;
    modalRef.componentInstance.walls = this.wallsArray.membership;
    modalRef.componentInstance.is_admin = this.userArmin;
    modalRef.result.then((post) => {

    });
  }

  likeAndUnlikePost(post_id: number, flag: number, post: any): void{

    this.requestService.postLikeAndUnlike(post_id, flag).subscribe(
        data=>{
          post.liked_by_user = flag ? 0 : 1;
          post.liked_by_user ? post.likes_count++ : post.likes_count--
        },
        error => {this.error = error; console.log(error);}
    )
  }

  removePost(post: any, index: number): void {

    this.requestService.postDelete(post.post_id, post.room_id).subscribe(
        data=>{
          this.allPosts.splice(index, 1)
          this.exchangeService.changeQuontityOfItemsInUserSettings('post')
        },
        error => {this.error = error; console.log(error);}
    )
  }

  onScrollRichTheEnd(event): void {

    if (this.flagMoveY){
        this.post_offset = this.allPosts[this.allPosts.length - 1].post_id;
        this.flagMoveY = false;
        this.getUserPosts()
    }

  }

}
