import { Component, OnInit } from '@angular/core';
import { RequestService, EventsExchangeService } from '../../services/index';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notification_offset: number;
  notifications: any[];
  notifications_type: string;
  show_loading: boolean;
  flagMoveY: boolean = true;

  constructor(private requestService : RequestService,
              private exchangeService: EventsExchangeService) { }

  ngOnInit() {

    this.notification_offset = 0;
    this.notifications = [];
    this.notifications_type = 'Personal';
    this.show_loading = true;

    this.getNewNotifications();
  }

  getNewNotifications():void {

    let dataToServer = {
      type: this.notifications_type,
      offset_id: this.notification_offset,
      direction_flag: 0,
      'new': 0
    };

    this.show_loading = true;

    this.requestService.getUserNotifications(dataToServer).subscribe(
        data=>{
          if (data['notifications'].length){
            this.notifications = this.notifications.concat(data['notifications']);
            this.flagMoveY = true;
          }
          this.show_loading = false;
        },
        error => {
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get new notifications from a server'})
        }
    )
  }

  changeNotificationsType(type: string):void {

    if (type != this.notifications_type){
      this.flagMoveY = false;
      this.notifications_type = type;
      this.notification_offset = 0;
      this.notifications = [];
      this.getNewNotifications()
    }
  }

  onScrollRichTheEnd(event): void {

    if (this.flagMoveY){
      this.notification_offset = this.notifications[this.notifications.length - 1].created_at;
      this.flagMoveY = false;
      this.getNewNotifications()
    }

  }

}
