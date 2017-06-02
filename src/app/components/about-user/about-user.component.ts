import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import { EventsExchangeService } from '../../services/events-exchange.service';

import { RequestService } from '../../services/request.service';


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
  tree: any;
  child_preficse: string;

  constructor(private activateRoute: ActivatedRoute,
              private requestService: RequestService,
              private router: Router,
              private exchangeService: EventsExchangeService) { }

  ngOnInit():void {

    let parses = this.router.parseUrl(this.router.url);
    this.tree = parses.root.children.primary.segments;
    this.tree.length > 3 ? this.child_preficse = '/user-settings' : this.child_preficse = '';
    this.subscription = this.activateRoute.params.subscribe(params=>{this.user_id = params.id; console.log(params)});
    this.getUserInfo();

    this.exchangeService.dataChangedFromUserSettings.subscribe(
        search => {
          this.changeTagsData(search)
        });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  getUserInfo(): void {

    this.requestService.getUserDetails(this.user_id).subscribe(
        data=>{
          this.currentUser = data['user'];
        },
        error => {this.error = error; console.log(error);}
    )
  }

  faveAndUnfave(): void {

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

  changeTagsData(flag: string):void {

    flag === 'post' &&  this.currentUser.posts_count--;
    this.child_preficse && flag === 'fave' && this.currentUser.faves_count++;
    this.child_preficse && flag === 'unfave' && this.currentUser.faves_count--
  }

}
