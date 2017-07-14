import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, UrlSegmentGroup, UrlTree, PRIMARY_OUTLET, UrlSegment, ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import { RequestService } from '../../services/request.service';
import {UserStoreService} from '../../services/user-store.service';

import { Post } from '../../commonClasses/posts';
import { UserInfo } from '../../commonClasses/userInfo';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { EventsExchangeService } from '../../services/events-exchange.service';
import { SafariErrorsFixService } from '../../services/safari-errors-fix.service';
import { ScrollToTopService } from '../../services/scroll-to-top.service';
import {CreatePostComponent} from '../../modals/create-post/create-post.component';
import {PostEditeComponent} from '../../modals/post-edite/post-edite.component';

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
  roomAlias: string;
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
  offset: number;
  flagMoveY: boolean = true;
  show_loading: boolean;
    filter_switcher: string;
    posts_search: string;
    show_hide_toggle:boolean;
    show_to_top:boolean;
    currentRoute:string;
    routerSubscription: any;
    without_child_route:boolean;
    @ViewChild('scrollArea') scrollArea;

  constructor(private activateRoute: ActivatedRoute,
              private requestService: RequestService,
              private exchangeService: EventsExchangeService,
              private storeservice: UserStoreService,
              private modalService: NgbModal,
              private router: Router,
                private safariService: SafariErrorsFixService,
                 private scrollToTop: ScrollToTopService){

      this.routerSubscription = this.router.events.subscribe(event=>{

          if (event instanceof NavigationEnd ){
              let parses: UrlTree = this.router.parseUrl(this.router.url);
              let segmentGroup: UrlSegmentGroup = parses.root.children[PRIMARY_OUTLET];
              let segments: UrlSegment[] = segmentGroup.segments;

              if (window.innerWidth <= 1024){
                  segments.length === 2 ? this.without_child_route = true : this.without_child_route = false
              } else {
                  this.without_child_route = true
              }

          }
      })
  }

  ngOnDestroy(){

    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  ngOnInit() {

    this.allPosts = [];
    this.offset = 0;
    this.show_loading = true;
    this.filter_switcher = 'show_all';
    this.currentUserData = this.storeservice.getUserData();

    this.subscription = this.activateRoute.params.subscribe(params=>{this.roomAlias = params['alias']});

    this.requestService.getWalls(this.roomAlias).subscribe(
        data=>{
            if (data && data['message'] === undefined){

                this.wallsArray = data['room_walls'];
                this.wallId = this.wallsArray.walls[0].wall_id;
                this.currentWall = this.wallsArray.walls[0];
                this.roomTags = this.wallsArray.walls;
                this.storeservice.storeCurrentUserRooms(this.wallsArray);
                this.isAdmin();
                this.exchangeService.pushEventGetWalls();
                this.roomId = this.wallsArray.room_details.room_id;
                this.wallsArray['is_admin'] = this.userArmin;
                this.getPosts();
                this.wallsIds = this.wallId;
            }
        },
        error => {
            if (error && error.room_detals ){
                this.wallsArray = [];
                this.openPrivateRoomModal(error.room_detals)
            }else {
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get walls of the room'});
                this.router.navigateByUrl('explore')
            }

        }
    );

  }
    isAdmin():void {

        this.membership = this.storeservice.getStoredCurrentUserRooms().membership;
        this.membership['admin'] || this.membership['moderator'] || this.membership['supermoderator'] ? this.userArmin = true : this.userArmin = false;
    }

  getPosts(): void {

      let dataToServer = {
          wall_id: this.wallId,
          offset_id: this.offset,
          direction_flag: 0,
          user_name_post: this.posts_search,
          room_id: this.roomId
      };

      this.show_loading = true;

      this.filter_switcher === 'show_all' && this.requestService.getRoomPosts(dataToServer).subscribe(
        data=>{
           this.handleSuccessRequest(data, dataToServer)

        },
        error => {
            this.handleErrorRequest(error)
    });

      this.filter_switcher === 'faves' && this.requestService.getFavedRoomsPosts(dataToServer).subscribe(
          data=>{
              this.handleSuccessRequest(data, dataToServer)
          },
          error => {
              this.handleErrorRequest(error)
          });

      this.filter_switcher === 'user_name_post' && this.requestService.getOnlyUsersPosts(dataToServer).subscribe(
          data=>{
              this.handleSuccessRequest(data, dataToServer)
          },
          error => {
              this.handleErrorRequest(error)
          });

      this.filter_switcher === 'search_term' && this.requestService.getPostsBySearchText(dataToServer).subscribe(
          data=>{
              this.handleSuccessRequest(data, dataToServer)
          },
          error => {
              this.handleErrorRequest(error)
          })

  }

  handleSuccessRequest(data: any, dataToServer: any): void {

      if (data['posts'].length){
          this.allPosts = this.allPosts.concat(data['posts']);
          this.flagMoveY = true;
          this.wallId = dataToServer.wall_id
          this.safariService.addSafariClass()
      }
      this.show_loading = false;
  }

  handleErrorRequest(error: any):void {

      this.error = error;
      console.log(error);
      this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get posts of the room'})
  }

    postOwnerInterraction(int_key: string, block_owner_id: number): void {

      let dataToServer = {
          user_interract_key: int_key,
          user_interract_id: block_owner_id,
          flag: 1
      };

        this.requestService.blockOrMuteUser(dataToServer).subscribe(
            data=>{
                int_key === 'mute' ||  int_key === 'block' ?  this.allPosts = this.allPosts.filter((post)=>{return post.owner.user_id !== block_owner_id}) : ''
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
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
                this.allPosts.splice(index, 1)
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t remove this post'})}
        )
    }

    likeAndUnlikePost(post_id: number, flag: number, post: any): void{

        this.requestService.postLikeAndUnlike(post_id, flag).subscribe(
            data=>{
                post.liked_by_user = flag ? 0 : 1;
                post.liked_by_user ? post.likes_count++ : post.likes_count--
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
        )
    }

    inappropriatePost(post: Post):void {

        this.requestService.postInappropriate(post.post_id).subscribe(
            data=>{
                this.exchangeService.doShowVisualMessageForUser({success:true, message: 'Post marked as inappropriate'})
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
        )
    }

    userToBan(data: any): void {

        this.requestService.userToBan(data).subscribe(
            data=>{
                this.exchangeService.doShowVisualMessageForUser({success:true, message: 'User banned successful'})
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
        )
    }

    movePost(data: any, index: number): void {

        this.requestService.movePost(data).subscribe(
            data=>{
                this.allPosts.splice(index, 1)
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t move the post'})}
        )
    }

    openNewPostModal(): void {

        const modalRef = this.modalService.open(CreatePostComponent);
        modalRef.componentInstance.room_id = this.roomId;
        modalRef.componentInstance.wall_id = this.wallId;
        modalRef.componentInstance.allow_comment_flag = this.wallsArray.walls[0].allow_comment_flag;
        modalRef.result.then((newPost) => {
            this.allPosts.unshift(newPost.post)
        }).catch(()=>{});
    }

    openPrivateRoomModal(data: any): void {

        const modalRef = this.modalService.open(PrivateRoomComponent);
        modalRef.componentInstance.room_details = data;
        modalRef.result.then(() => {
            this.router.navigateByUrl('/explore');
        }).catch(() => {
            this.router.navigateByUrl('/explore');
        });
    }

    openEditPOstModal(post: Post, index):void {

        const modalRef = this.modalService.open(PostEditeComponent);
        modalRef.componentInstance.post = post;
        modalRef.result.then((editedPost) => {
            this.allPosts.splice(index, 1, editedPost.post)
        }).catch(()=>{});
    }

    goToAnotherWall(tag: any, flag: boolean): void {

      if (flag){
          this.currentWall = tag;
          this.wallId = tag.wall_id;
          this.allPosts = [];
          this.offset = 0;
          this.flagMoveY = false;
          this.getPosts()
      }

    }

    interractWithUser(flag: string):void {

        this.wallsArray.room_details.flag = flag;
        this.requestService.joinAndLeaveRoom(this.wallsArray.room_details).subscribe(
            data=>{
                this.wallsArray.membership.member = this.wallsArray.membership.member === 1 ? 0 : 1;
            },
            error => {
                this.error = error;
                console.log(this.error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
        )
    }

    onMouseLeave(post: Post): void {

       post['bunned'] = false;
       post['movedTo'] = false;
    }





    onScrollRichTheEnd(event): void {

        if (this.flagMoveY){
            this.offset = this.allPosts[this.allPosts.length - 1].post_id;
            this.flagMoveY = false;
            this.getPosts()
        }

    }

    doFilteringResults(value: string):void {

      this.filter_switcher = value;
        this.posts_search = '';
       if(value === 'show_all' || value === 'faves'){
           this.allPosts = [];
           this.offset = 0;
           this.flagMoveY = false;
           value === 'show_all' ? this.show_hide_toggle = false : '';
           this.getPosts();
       }
    }

    doSearch(value: string):void {

        this.posts_search = value.trim();
        if (this.posts_search){
            this.allPosts = [];
            this.offset = 0;
            this.flagMoveY = false;
            this.getPosts()
        }
    }

    onScrollAction(event:any):void {

        this.show_to_top = event
    }

    scrollToTopFunction():void {

        this.scrollToTop.scrollMethod(this.scrollArea.nativeElement, 0, 100);
        this.show_to_top = false;
    }
}
