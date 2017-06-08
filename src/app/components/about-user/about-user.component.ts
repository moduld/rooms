import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import { EventsExchangeService } from '../../services/events-exchange.service';

import { RequestService } from '../../services/request.service';
import {UserStoreService} from '../../services/user-store.service';


@Component({
  selector: 'app-about-user',
  templateUrl: './about-user.component.html',
  styleUrls: ['./about-user.component.scss']
})
export class AboutUserComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  error: any;
  user_id: any;
  currentUser: any;
  child_preficse: string;

  constructor(private storeservice: UserStoreService,
              private activateRoute: ActivatedRoute,
              private requestService: RequestService,
              private router: Router,
              private exchangeService: EventsExchangeService) { }

  ngOnInit():void {

    this.subscription = this.activateRoute.params.subscribe(params=>{
      this.user_id = params.id;
      this.getUserInfo();
    });


    this.exchangeService.dataChangedFromUserSettings.subscribe(
        search => {
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
          console.log(this.currentUser)
        },
        error => {this.error = error; console.log(error);}
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
          error => {this.error = error; console.log(error);}
      )
    }
  }

  changeTagsData(flag: string):void {

    flag === 'post' &&  this.currentUser.posts_count--;
    this.child_preficse && flag === 'fave' && this.currentUser.faves_count++;
    this.child_preficse && flag === 'unfave' && this.currentUser.faves_count--
  }

  goToPrivateDialog(flag: boolean):void {

    !flag && this.router.navigate( ['user-dialogs', {user: this.currentUser.user_id}]);
  }

}
