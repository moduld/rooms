import { Component, OnInit} from '@angular/core';
import { Router, NavigationEnd, UrlSegmentGroup, UrlTree, PRIMARY_OUTLET, UrlSegment, ActivatedRoute } from '@angular/router';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { RequestService, UserStoreService, EventsExchangeService } from '../../services/index';
import {AboutRoomModalComponent} from '../../modals/index';

@Component({
  selector: 'app-about-room',
  templateUrl: 'about-room.component.html',
  styleUrls: ['about-room.component.scss']
})
export class AboutRoomComponent implements OnInit {


  routerSubscription:any;
  roomAlias: string;
  roomDetails: any;

  constructor(private activateRoute: ActivatedRoute,
              private requestService: RequestService,
              private exchangeService: EventsExchangeService,
              private storeservice: UserStoreService,
              private modalService: NgbModal,
              private router: Router) {

    this.routerSubscription = this.router.events.subscribe(event=>{

      if (event instanceof NavigationEnd ){
        let parses: UrlTree = this.router.parseUrl(this.router.url);
        let segmentGroup: UrlSegmentGroup = parses.root.children[PRIMARY_OUTLET];
        let segments: UrlSegment[] = segmentGroup.segments;
        this.roomAlias = segments[1].path;
        this.getRoomInfo();


      }
    })
  }

  ngOnInit() {
  }

  ngOnDestroy(){

    this.routerSubscription.unsubscribe();
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
