import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';
import {UserStoreService} from '../../services/user-store.service';

import { Wall } from '../../commonClasses/wall';
import { Post } from '../../commonClasses/posts';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {CreatePostComponent} from '../../modals/create-post/create-post.component';
import {PostEditeComponent} from '../../modals/post-edite/post-edite.component';


@Component({
  selector: 'app-inside-room',
  templateUrl: 'inside-room.component.html',
  styleUrls: ['inside-room.component.css']
})
export class InsideRoomComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  error: any;
  roomId: any;
  wallId: any;
  allPosts: Post[];
  userArmin: boolean;
  roomTags: any[];

  constructor(private activateRoute: ActivatedRoute,
              private requestService: RequestService,
              private exchangeService: EventsExchangeService,
              private storeservice: UserStoreService,
              private modalService: NgbModal){
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription = this.activateRoute.params.subscribe(params=>{this.roomId = params.id});

    this.requestService.getWalls(this.roomId).subscribe(
        data=>{
            console.log(data)
          this.wallId = data.walls[0].wall_id;
          this.roomTags = data.walls;
          this.storeservice.storeCurrentUserRooms(data);
          this.exchangeService.wallsToHeader(data);
          this.getPosts(this.wallId);
          this.isAdmin()
        },
        error => {this.error = error; console.log(error);}
    );

      this.exchangeService.changeHeaderView(false);

  }
    isAdmin():void {
        let storedUserData = this.storeservice.getStoredCurrentUserRooms().membership;
        console.log(storedUserData)
        storedUserData['admin'] || storedUserData['moderator'] || storedUserData['supermoderator'] ? this.userArmin = true : this.userArmin = false;
        console.log(this.userArmin)
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

    postOwnerInterraction(int_key: string, owner_id: number): void {
        this.requestService.postInteractionUser(int_key, owner_id, int_key, 1).subscribe(
            data=>{
                console.log(data);

            },
            error => {this.error = error; console.log(error);}
        )
    }

    postInterraction(int_key: string, post: Post, index?: number): void {

      if (int_key === 'remove'){
          this.removePost(post, index)
      }
      if (int_key === 'edite'){
          this.openEditPOstModal(post, index)
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

    openNewPostModal(): void {
        const modalRef = this.modalService.open(CreatePostComponent);
        modalRef.componentInstance.room_id = this.roomId;
        modalRef.componentInstance.wall_id = this.wallId;
        modalRef.result.then((newPost) => {
            this.allPosts.unshift(newPost.post)
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
      flag && this.getPosts(tag.wall_id)
    }


}
