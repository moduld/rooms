import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import { EventsExchangeService, RequestService, UserStoreService } from '../../services/index';

@Component({
  selector: 'app-about-user',
  templateUrl: './about-user.component.html',
  styleUrls: ['./about-user.component.scss']
})
export class AboutUserComponent implements OnInit, OnDestroy {

  private subscription: any;
  error: any;
  user_id: any;
  currentUser: any;


  constructor(private storeservice: UserStoreService,
              private activateRoute: ActivatedRoute,
              private requestService: RequestService,
              private router: Router,
              private exchangeService: EventsExchangeService) {

  }

  ngOnInit():void {

    this.subscription = this.activateRoute.params.subscribe((params)=>{

      this.user_id = params['id'] / 22;

      this.getUserInfo();
    });

    //to increase or decrease value inside buttons (switchers between user rooms, posts, favs, fans)
    this.exchangeService.dataChangedFromUserSettings.subscribe((search) => {

          this.changeTagsData(search)
        });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  getUserInfo(): void {

    let loginnedUser = this.storeservice.getUserData();

    this.requestService.getUserDetails(this.user_id).subscribe(
        data=>{
          this.currentUser = data['user'];
          this.currentUser.is_myne = this.currentUser.user_id == loginnedUser.user_data.user_id;
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error['message'] || 'Something wrong, can\'t get user info'})
        }
    )
  }

  faveAndUnfave(flag: boolean): void {

    if (!flag){
      let dataToServer = {
        user_id_fave: this.currentUser.user_id,
        is_fave: this.currentUser.is_fave
      };

      this.requestService.faveUnfaveUser(dataToServer).subscribe(
          data=>{
            this.currentUser.is_fave = !this.currentUser.is_fave;
            this.currentUser.is_fave ? this.currentUser.fans_count++ : this.currentUser.fans_count--;
          },
          error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
      )
    } else {
      this.exchangeService.doShowVisualMessageForUser({success:false, message: 'You can\'t fave  oneself'})
    }
  }
  //when user delete or add post or user e.t.c. this method change value in according button
  changeTagsData(flag: any):void {

    flag === 'post' &&  this.currentUser.posts_count--;
    flag === 'fave' && this.currentUser.faves_count++;
    flag === 'unfave' && this.currentUser.faves_count--
  }

  goToPrivateDialog(flag: boolean):void {

    this.currentUser.is_myne && this.exchangeService.doShowVisualMessageForUser({success:false, message: 'You can\'t speak to oneself'});
    !this.currentUser.msg_from_anyone && !this.currentUser.is_fan && this.exchangeService.doShowVisualMessageForUser({success:false, message: 'You can\'t speak to this user'});
    !flag && this.router.navigate( ['user-dialogs', {user: this.currentUser.user_id*22}]);
  }

  onScrollRichTheEnd(event): void {

    this.exchangeService.pushEventUrlReachEnd()

  }

  userInterraction(int_key: string):void {

    let dataToServer = {
      user_interract_key: int_key,
      user_interract_id: this.currentUser.user_id,
      flag: 1
    };

    this.requestService.blockOrMuteUser(dataToServer).subscribe(
        data=>{
          this.exchangeService.doShowVisualMessageForUser({success:true, message: 'User muted/blocked successful'})
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t make this action'})}
    )
  }

}
