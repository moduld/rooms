import { Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { RequestService, UserStoreService, EventsExchangeService, RouterEventsListenerService } from '../../services/index';
import {AboutRoomModalComponent} from '../../modals/index';

@Component({
  selector: 'app-about-room',
  templateUrl: 'about-room.component.html',
  styleUrls: ['about-room.component.scss']
})
export class AboutRoomComponent {


  routerChangeSubscription: any;
  roomAlias: string;
  roomDetails: any;

  constructor(private activateRoute: ActivatedRoute,
              private requestService: RequestService,
              private exchangeService: EventsExchangeService,
              private storeservice: UserStoreService,
              private modalService: NgbModal,
              private routesListener: RouterEventsListenerService,
              private router: Router) {

    this.routerChangeSubscription = this.routesListener.routeChangedEvent.subscribe((data)=>{
      this.roomAlias = data.segmentsArr[1].path;
      this.getRoomInfo();
    });
  }


  ngOnDestroy(){

    this.routerChangeSubscription.unsubscribe();
  }

  getRoomInfo():void {

    this.roomDetails = this.storeservice.getStoredCurrentUserRooms() && this.storeservice.getStoredCurrentUserRooms().room_details;

    if (this.roomDetails){
      this.openAboutRoomModal()
    } else {
      this.requestService.getWalls(this.roomAlias).subscribe(
          data=>{
            if (data && data['message'] === undefined){
              this.roomDetails = data['room_walls'].room_details;
              this.openAboutRoomModal()
            }
          },
          error => {
            if (error && error.room_detals ){

            }else {
              this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get walls of the room'});
              this.router.navigateByUrl('explore')
            }

          }
      );
    }
  }




  openAboutRoomModal():void {

    const modalRef = this.modalService.open(AboutRoomModalComponent);
    modalRef.componentInstance.room_details = this.roomDetails;
    modalRef.result.then(() => {
      this.router.navigate(["../"], { relativeTo: this.activateRoute })
    }).catch(()=>{
      this.router.navigate(["../"], { relativeTo: this.activateRoute })
    });
  }

}
