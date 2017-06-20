import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

@Component({
  selector: 'app-notifications-settings',
  templateUrl: 'notifications-settings.component.html',
  styleUrls: ['notifications-settings.component.scss']
})
export class NotificationsSettingsComponent implements OnInit {

  states_switcher:boolean;
  switchers: any = {
    post_like_notification_app: 0,
    post_like_notification_push: 0,
    comment_notification_app: 0,
    comment_notification_push: 0,
    faved_notification_app: 0,
    faved_notification_push: 0,
    message_notification_app: 0,
    message_notification_push: 0,
    room_join_request_notification_app: 0,
    room_join_request_notification_push: 0,
    added_moderator_notification_app: 0,
    added_moderator_notification_push: 0,
    added_talker_notification_app: 0,
    added_talker_notification_push: 0,
    post_in_room_notification_app: 0,
    post_in_room_notification_push: 0
  };
  has_changes: boolean;

  constructor(private requestService : RequestService,
              private exchangeService: EventsExchangeService) { }

  ngOnInit() {
    this.states_switcher = false;
    this.has_changes = false;
    this.getNewNotificationsSettings()
  }

  getNewNotificationsSettings():void {

    this.requestService.getUserNotificationsSettings().subscribe(
        data=>{
          if (data){
            this.switchers = data['notification_settings'];
            delete this.switchers['created_at'];
            delete this.switchers['updated_at'];
            delete this.switchers['user_id'];
          }
        },
        error => {
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get  notifications settings from a server'})
        }
    )
  }

  saveSettings():void {

    if(this.has_changes){
      let dataToServer = {
        notification_settings: this.switchers
      };

      this.requestService.saveNotificationsSettings(dataToServer).subscribe(
          data=>{
            this.has_changes = false;
            this.exchangeService.doShowVisualMessageForUser({success:true, message: 'Changes saved successful'})
          },
          error => {
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get  notifications settings from a server'})
          }
      )
    } else {
      this.exchangeService.doShowVisualMessageForUser({success:false, message: 'You did not make any changes'})
    }
  }

  changeValue(key: any):void {

    this.has_changes = true;
    this.switchers[key] ?  this.switchers[key] = 0 : this.switchers[key] = 1;
  }


}
