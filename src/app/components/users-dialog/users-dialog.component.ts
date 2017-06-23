import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

@Component({
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss']
})
export class UsersDialogComponent implements OnInit, OnDestroy {

  error: any;
  dialog_user_id: any;
  all_users: any[];
  current_user: any;
  virtual_user: any;
  eventToChild:Subject<any> = new Subject();
    routerSubscription: any;

  constructor( private requestService: RequestService,
               private router: Router,
               private route: ActivatedRoute,
               private exchangeService: EventsExchangeService) { }

  ngOnInit() {

    this.dialog_user_id = this.route.snapshot.params['user'] / 22;
    this.all_users = [];

      this.routerSubscription = this.router.events.subscribe(event=>{

          if (event instanceof NavigationEnd ){
              this.dialog_user_id = this.route.snapshot.params['user'] / 22;
              this.getUsersForDialog();
          }
      });

  }

  ngOnDestroy() {

      this.routerSubscription.unsubscribe()
  }


  getUsersForDialog(): void {

      this.requestService.getUserDialogUsersList().subscribe(
          data=>{
              this.all_users = data['messages'];

              if (data['messages'].length && this.dialog_user_id){
                  this.findCurrentUser()
              } else {
                  if (!this.dialog_user_id){
                      this.current_user = null
                  }
                  if (!data['messages'].length){
                      this.dialog_user_id && this.createUserVirtual()
                  }
              }
          },
          error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get users list from a server'})}
      );
  }

  findCurrentUser(): void {

    for (let i = 0; i < this.all_users.length; i++){

      if (this.all_users[i].user.user_id == this.dialog_user_id){

          this.current_user = this.all_users[i];
          this.eventToChild.next({flag: true, user: this.current_user});
        return
      }
    }

    this.createUserVirtual()

  }

  createUserVirtual():void {

    this.requestService.getUserDetails(this.dialog_user_id).subscribe(
        data=>{
          this.virtual_user = data['user'];
            this.eventToChild.next({flag: false, user: this.virtual_user});
        },
        error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get info about the user'})}
    );
  }

    changeDialogUser(flag: boolean, user: any): void {

      flag ? this.dialog_user_id = user.user.user_id : this.dialog_user_id = user.user_id;

        this.current_user = user;
        this.eventToChild.next({flag: flag, user: this.current_user});
    }

    refreshUsersList(): void {

      this.virtual_user = null;
      this.getUsersForDialog()
    }

}
