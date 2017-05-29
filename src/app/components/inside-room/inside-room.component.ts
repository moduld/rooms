import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import { RequestService } from '../../services/request.service';
// import { EventsExchangeService } from '../../services/events-exchange.service';
import {UserStoreService} from '../../services/user-store.service';

import { Wall } from '../../commonClasses/wall';
import { Post } from '../../commonClasses/posts';
import { UserInfo } from '../../commonClasses/userInfo';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {CreatePostComponent} from '../../modals/create-post/create-post.component';
import {PostEditeComponent} from '../../modals/post-edite/post-edite.component';
import {PostDetailsComponent} from '../../modals/post-details/post-details.component';
import {PrivateRoomComponent} from '../../modals/private-room/private-room.component';


@Component({
  selector: 'app-inside-room',
  templateUrl: 'inside-room.component.html',
  styleUrls: ['inside-room.component.scss']
})
export class InsideRoomComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  error: any;
  roomId: any;
  wallId: any;
  allPosts: Post[];
  userArmin: boolean;
  roomTags: any[];
  membership: any;
  currentUserData: UserInfo;
  banDays: number = 0;
    wallsIds: number;
    wallsArray: any;
    currentWall: any;

  constructor(private activateRoute: ActivatedRoute,
              private requestService: RequestService,
              // private exchangeService: EventsExchangeService,
              private storeservice: UserStoreService,
              private modalService: NgbModal,
              private router: Router){
  }

  ngOnDestroy(){

    this.subscription.unsubscribe();
  }

  ngOnInit() {

    this.currentUserData = this.storeservice.getUserData();
    this.subscription = this.activateRoute.params.subscribe(params=>{this.roomId = params.id});
    this.requestService.getWalls(this.roomId).subscribe(
        data=>{
            console.log(data)
            if (data && data['message'] === undefined){
                this.wallsArray = data['room_walls'];
                this.wallId = this.wallsArray.walls[0].wall_id;
                this.currentWall = this.wallsArray.walls[0];
                this.roomTags = this.wallsArray.walls;
                this.storeservice.storeCurrentUserRooms(this.wallsArray);
                this.isAdmin();
                this.wallsArray['is_admin'] = this.userArmin;
                this.getPosts(this.wallId);
                this.wallsIds = this.wallId;
            }
        },
        error => {
            this.error = error.json();
            if (error && error.json().room_detals ){
                this.wallsArray = [];
                this.openPrivateRoomModal(error.json().room_detals)
            }
        }
    );

  }
    isAdmin():void {

        this.membership = this.storeservice.getStoredCurrentUserRooms().membership;
        this.membership['admin'] || this.membership['moderator'] || this.membership['supermoderator'] ? this.userArmin = true : this.userArmin = false;
    }

  getPosts(wallId: number): void {

    this.requestService.getRoomPosts(wallId).subscribe(
        data=>{
          console.log(data);
          this.allPosts = data;
          this.wallId = wallId
        },
        error => {this.error = error; console.log(error);}
    )
  }

    postOwnerInterraction(int_key: string, block_owner_id: number): void {

        this.requestService.blockOrMuteUser(int_key, block_owner_id, 1).subscribe(
            data=>{
                int_key === 'mute' ||  int_key === 'block' ?  this.allPosts = this.allPosts.filter((post)=>{return post.owner.user_id !== block_owner_id}) : ''
            },
            error => {this.error = error; console.log(error);}
        )
    }

    postInterraction(int_key: string, post: Post, index?: number, data?: number): void {

      if (int_key === 'remove'){
          this.removePost(post, index)
      }
      if (int_key === 'edite'){
          this.openEditPOstModal(post, index)
      }
      if (int_key === 'inappropriate'){
          this.inappropriatePost(post)
      }
        if (int_key === 'ban'){
            post['bunned'] = !post['bunned'];
        }
        if (int_key === 'do_ban'){
            post['ban_days'] = data;
            this.userToBan(post)
        }
        if (int_key === 'move'){
            post['movedTo'] = !post['movedTo'];
        }
        if (int_key === 'do_move'){
            post['move_to_wall_id'] = data;
            this.movePost(post, index)
        }
    }

    removePost(post: Post, index: number): void {

        this.requestService.postDelete(post.post_id, post.room_id).subscribe(
            data=>{
                console.log(data);
                this.allPosts.splice(index, 1)
            },
            error => {this.error = error; console.log(error);}
        )
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

    inappropriatePost(post: Post):void {

        this.requestService.postInappropriate(post.post_id).subscribe(
            data=>{

            },
            error => {this.error = error; console.log(error);}
        )
    }

    userToBan(data: any): void {

        this.requestService.userToBan(data).subscribe(
            data=>{
            },
            error => {this.error = error; console.log(error);}
        )
    }

    movePost(data: any, index: number): void {

        this.requestService.movePost(data).subscribe(
            data=>{
                this.allPosts.splice(index, 1)
            },
            error => {this.error = error; console.log(error);}
        )
    }

    openNewPostModal(): void {

        const modalRef = this.modalService.open(CreatePostComponent);
        modalRef.componentInstance.room_id = this.roomId;
        modalRef.componentInstance.wall_id = this.wallId;
        modalRef.componentInstance.allow_comment_flag = this.wallsArray.walls[0].allow_comment_flag;
        modalRef.result.then((newPost) => {
            this.allPosts.unshift(newPost.post)
        });
    }

    openPrivateRoomModal(data: any): void {

        const modalRef = this.modalService.open(PrivateRoomComponent);
        modalRef.componentInstance.room_details = data;
        modalRef.result.then(() => {
            this.router.navigateByUrl('/all-rooms');
        }).catch(() => {
            this.router.navigateByUrl('/all-rooms');
        });
    }

    openEditPOstModal(post: Post, index):void {

        const modalRef = this.modalService.open(PostEditeComponent);
        modalRef.componentInstance.post = post;
        modalRef.result.then((editedPost) => {
            this.allPosts.splice(index, 1, editedPost.post)
        });
    }

    goToAnotherWall(tag: any, flag: boolean): void {

      this.currentWall = tag;
      flag && this.getPosts(tag.wall_id)
    }

    onMouseLeave(post: Post): void {

       post['bunned'] = false;
       post['movedTo'] = false;
    }

    voteForPost(assessment: string, post: Post): void {

        post['voted_data'] = assessment;
        this.requestService.votePost(post).subscribe(
            data=>{
                post['poll'] = data.poll;
            },
            error => {this.error = error; console.log(error);}
        )
    }

    openPostDetailsModal(post: Post):void {

        const modalRef = this.modalService.open(PostDetailsComponent);
        modalRef.componentInstance.post = post;
        modalRef.componentInstance.walls = this.membership;
        modalRef.componentInstance.is_admin = this.userArmin;
        modalRef.result.then((post) => {

        });
    }
}
