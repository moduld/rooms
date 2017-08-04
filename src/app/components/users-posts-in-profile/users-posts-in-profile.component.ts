import { Component, OnInit, OnDestroy} from '@angular/core';

import { RequestService, UserStoreService, EventsExchangeService, SafariErrorsFixService, RouterEventsListenerService } from '../../services/index';

@Component({
  selector: 'app-users-posts-in-profile',
  templateUrl: 'users-posts-in-profile.component.html',
  styleUrls: ['users-posts-in-profile.component.scss']
})
export class UsersPostsInProfileComponent implements OnInit, OnDestroy{

  error: any;
  allPosts: any[];
  user_id: any;
  post_offset: number;
  currentUserData: any;
  flagMoveY: boolean = true;
  show_loading: boolean;
    routerChangeSubscription: any;

  constructor(private storeservice: UserStoreService,
              private requestService: RequestService,
              private exchangeService: EventsExchangeService,
              private safariService: SafariErrorsFixService,
              private routesListener: RouterEventsListenerService) {

      this.routerChangeSubscription = this.routesListener.routeChangedEvent.subscribe((data)=>{
          this.user_id = Number(data.segmentsArr[1].path) / 22;
          this.getUserPosts()
      });
  }

  ngOnInit() {
    this.currentUserData = this.storeservice.getUserData();
    this.allPosts = [];
    this.post_offset = 0;
    this.show_loading = false;



    this.exchangeService.srcrooReachEndEvent.subscribe(()=>{

        if (this.flagMoveY){
            this.post_offset = this.allPosts[this.allPosts.length - 1].post_id;
            this.flagMoveY = false;
            this.getUserPosts()
        }
    });

  }

    ngOnDestroy() {

        this.routerChangeSubscription && this.routerChangeSubscription.unsubscribe()
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
            this.safariService.addSafariClass()
        },
        error => {
          console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get posts from a server'})
        }
    );
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

  removePost(post: any, index: number): void {

    this.requestService.postDelete(post.post_id, post.room_id).subscribe(
        data=>{
          this.allPosts.splice(index, 1);
          this.exchangeService.changeQuontityOfItemsInUserSettings('post')
        },
        error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
    )
  }

}
