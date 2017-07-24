import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PostDetailsComponent} from '../../modals/index';
import { RequestService, UserStoreService, EventsExchangeService, FileInfoService, LinkPreviewService } from '../../services/index';

import { Lightbox } from 'angular2-lightbox';

@Component({
  selector: 'app-post-details-main',
  templateUrl: 'post-details-main.component.html',
  styleUrls: ['post-details-main.component.scss']
})
export class PostDetailsMainComponent implements OnInit, OnDestroy {

  show_component: boolean;
  subscription: any;
  postId: string;
  membership: any;
  userArmin: boolean;
  eventSubscription: any;
  post: any;

  error: any;
  mediaToAppServer: any;
  inProcess: boolean;
  dataToServer: any = {};
  textField: string = '';
  banDays: number = 0;
  currentUserData: any;
  flagMoveY: boolean = true;
  comments_sort_type: string;
  comment_offset: number;
  comments: any[];
  show_loading: boolean;
  loaded_image_url: string = '';
  disable_submit_button:boolean;

  @HostBinding('class') showHost = '';

  constructor(
      private activateRoute: ActivatedRoute,
      private requestService: RequestService,
      private exchangeService: EventsExchangeService,
      private storeservice: UserStoreService,
      private modalService: NgbModal,
      private router: Router,
      private fileService: FileInfoService,
      private linkPreview: LinkPreviewService,
      private _lightbox: Lightbox
  ) {

  }

  ngOnInit() {

    this.currentUserData = this.storeservice.getUserData();
    this.comments_sort_type = 'date_newer';
    this.comment_offset = 0;
    this.comments = [];
    this.show_loading = false;


    this.subscription = this.activateRoute.params.subscribe(params=>{
      this.postId = params['post_id'];

      if (this.storeservice.getStoredCurrentUserRooms() && this.storeservice.getStoredCurrentUserRooms().membership){
        this.startActions()
      } else {
        this.eventSubscription = this.exchangeService.getWallsForRoomEvent.subscribe(()=>{
          this.startActions()
        });
      }
    });

    this.linkPreview.getPrevienLinkEvent.subscribe(data=>{
      this.comments = this.comments.map((comment)=>{

        comment.comment_id === data.message_id && comment.previews.push(data);

        return comment
      })
    })

  }

  startActions():void {

    this.isAdmin();
    this.getPostById();

  }

  ngOnDestroy() {

    this.subscription.unsubscribe();
    this.eventSubscription && this.eventSubscription.unsubscribe()
  }

  isAdmin():void {

    this.membership = this.storeservice.getStoredCurrentUserRooms().membership;
    this.membership['admin'] || this.membership['moderator'] || this.membership['supermoderator'] ? this.userArmin = true : this.userArmin = false;
  }




  getPostById():void {

    this.requestService.getPostsById(this.postId).subscribe(
        data=>{
          data && data['post'] && this.openPostDetails(data['post'])
        },
        error => {
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get post details'})
        }
    );
  }





  openPostDetails(post: any):void {


    if (window.innerWidth <= 1024){
      this.post = post;
      this.getComments();
      this.show_component = true;
      this.showHost = 'show_host';
    } else {

      const modalRef = this.modalService.open(PostDetailsComponent);
      modalRef.componentInstance.post = post;
      modalRef.componentInstance.walls = this.membership;
      modalRef.componentInstance.is_admin = this.userArmin;
      modalRef.result.then((post) => {
        this.router.navigate(['./'])
      }).catch(() => {
        this.router.navigate(["../../"], {relativeTo: this.activateRoute})
      });
    }


    }


  likeAndUnlikePost(post_id: number, flag: number): void{

    this.requestService.postLikeAndUnlike(post_id, flag).subscribe(
        data=>{
          this.post.liked_by_user = flag ? 0 : 1;
          this.post.liked_by_user ? this.post.likes_count++ : this.post.likes_count--
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
    )
  }



  fileDropped(event: any): void {

    this.disable_submit_button = true;
    this.mediaToAppServer = this.fileService.toNowFileInfo(event.srcElement && event.srcElement.files[0] || event.target && event.target.files[0]);

    if (this.mediaToAppServer.typeForApp === 'image' || this.mediaToAppServer.typeForApp === 'audio'){

      this.inProcess = true;
      this.requestService.getLinkForFileUpload(this.mediaToAppServer).subscribe(
          data=>{
            this.mediaToAppServer.link = data.urls[0];
            this.putFileToServer(this.mediaToAppServer)
          },
          error => {
            this.error = error;
            console.log(error);
            this.disable_submit_button = false;
            this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get link for the file'})}
      );
    }
  }

  putFileToServer(settings: any): void {

    this.requestService.fileUpload(settings).subscribe(
        data=>{
          this.inProcess = false;
          this.disable_submit_button = false;
          if (data.typeForApp === 'image'){
            this.loaded_image_url = data.multimedia
          }
        },
        error => {
          this.error = error;
          console.log(error);
          this.disable_submit_button = false;
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t send the file'})}
    );
  }

  createNewComment(commentForm: NgForm, event: Event):void {

    event.preventDefault();
    let text = commentForm.value.text ? commentForm.value.text.trim() : '';
    if (text || this.mediaToAppServer){
      this.disable_submit_button = true;
      this.dataToServer.post = this.post;
      this.dataToServer.text = text;
      if (this.mediaToAppServer){

        this.dataToServer.media = {
          type: this.mediaToAppServer['typeForApp'],
          multimedia: this.mediaToAppServer['multimedia']
        }
      } else {
        this.dataToServer.media = []
      }

      this.requestService.createNewComment(this.dataToServer).subscribe(
          data=>{
            this.comment_offset = 0;
            this.comments_sort_type = 'date_newer';
            this.comments = [];
            this.getComments();
            this.loaded_image_url = '';
            this.disable_submit_button = false;
          },
          error => {
            this.error = error;
            console.log(error);
            this.disable_submit_button = false;
            this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t add new comment'})}
      );

      commentForm.resetForm();
      this.mediaToAppServer = '';
    }

  }

  onScrollRichTheEnd(event): void {

    if (this.flagMoveY && this.comments.length){
      if (this.comments_sort_type === 'top'){
        this.comments_sort_type = 'date_newer';
        this.comment_offset = 0;
        this.getComments()
      } else {
        this.comment_offset = this.comments[this.comments.length - 1].comment_id;
        this.getComments()
      }
      this.flagMoveY = false;
    }

  }

  changeSorting(): void {

    if (this.comments.length){
      this.comment_offset = 0;
      this.comments = [];
      this.getComments()
    }
  }

  getComments(): void {

    this.show_loading = true;
    let dataToServer = this.post;
    dataToServer.offset = this.comment_offset;
    dataToServer.order_by = this.comments_sort_type;

    this.requestService.getPostComments(dataToServer).subscribe(
        data=>{
          if (data['comments'] && data['comments'].length){
            for(let i = data['comments'].length; i--; data['comments'][i]['previews'] = []){}

            this.comments = this.comments.concat(data['comments']);

            this.linkPreview.makePreviews(data['comments'])
            this.flagMoveY = true;
          }
          this.show_loading = false;
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get comments list'})}
    );
  }

  likeAndUnlikeComment(comment: any):void {

    let dataToServer = {
      comment_id: comment.comment_id,
      like: comment.liked_by_user ? 0 : 1
    };

    this.requestService.commentLike(dataToServer).subscribe(
        data=>{
          comment.liked_by_user = comment.liked_by_user ? 0 : 1;
          comment.liked_by_user ? comment.likes_count++ : comment.likes_count--
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
    );
  }

  commentOwnerInterraction(int_key: string, block_owner_id: number): void {

    let dataToServer = {
      user_interract_key: int_key,
      user_interract_id: block_owner_id,
      flag: 1
    };

    this.requestService.blockOrMuteUser(dataToServer).subscribe(
        data=>{
          int_key === 'mute' ||  int_key === 'block' ?  this.comments = this.comments.filter((comment)=>{return comment.owner.user_id !== block_owner_id}) : '';
          !this.comments.length && this.getComments()
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
    )
  }


  commentInterraction(int_key: string, comment: any, index?: number, data?: number): void {

    if (int_key === 'remove'){
      this.removeComment(comment, index)
    }
    if (int_key === 'inappropriate'){
      this.inappropriatePost(comment)
    }
    if (int_key === 'ban'){
      comment['bunned'] = !comment['bunned'];
    }
    if (int_key === 'do_ban'){
      comment['ban_days'] = data;
      this.userToBan(comment)
    }
  }

  removeComment(comment: any, index: number): void {

    let dataToServer = {
      comment_id: comment.comment_id,
      post_id: comment.post_id,
      room_id: comment.room_id
    };

    this.requestService.commentDelete(dataToServer).subscribe(
        data=>{
          this.comments.splice(index, 1)
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
    )
  }

  inappropriatePost(comment: any): void {

    let dataToServer = {
      comment_id: comment.comment_id
    };

    this.requestService.commentReport(dataToServer).subscribe(
        ()=>{
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

  onMouseLeave(comment: any): void {

    comment['bunned'] = false;
    comment['movedTo'] = false;
  }



  voteForPost(assessment: string): void {

    this.post['voted_data'] = assessment;
    this.requestService.votePost(this.post).subscribe(
        data=>{
          this.post['poll'] = data.poll;
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
    )
  }

  convertPollPercent(): any {

    let result = {
      first: this.post.poll.choice1total / (this.post.poll.choice1total + this.post.poll.choice2total + this.post.poll.choice3total + this.post.poll.choice4total) * 100 || 0,
      second: this.post.poll.choice2total / (this.post.poll.choice1total + this.post.poll.choice2total + this.post.poll.choice3total + this.post.poll.choice4total) * 100 || 0,
      third: this.post.poll.choice3total / (this.post.poll.choice1total + this.post.poll.choice2total + this.post.poll.choice3total + this.post.poll.choice4total) * 100 || 0,
      forth: this.post.poll.choice4total / (this.post.poll.choice1total + this.post.poll.choice2total + this.post.poll.choice3total + this.post.poll.choice4total) *100 || 0
    };

    return result
  }


  openLightBox(content):void {

    let album = [{
      src: content.multimedia,
      caption: '',
      thumb: content.thumbnail
    }];

    this._lightbox.open(album);
  }


}
