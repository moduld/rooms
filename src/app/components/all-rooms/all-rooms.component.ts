import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router,  ActivatedRoute } from '@angular/router';
import { RequestService, EventsExchangeService, AddRequiredInfoService, RouterEventsListenerService } from '../../services/index';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {CreateRoomComponent} from '../../modals/index';


@Component({
  selector: 'app-all-rooms',
  templateUrl: 'all-rooms.component.html',
  styleUrls: ['all-rooms.component.scss']
})
export class AllRoomsComponent implements OnInit, OnDestroy {

    error: any;
    allRooms: any[] = [];
    show_loading:boolean;
    routerChangeSubscription: any;
    currentRoute: string;
    queryString: string;

    constructor(private requestService: RequestService,
                private modalService: NgbModal,
                private router: Router,
                private route: ActivatedRoute,
                private exchangeService: EventsExchangeService,
                private routesListener: RouterEventsListenerService,
                private addRequiredInfo: AddRequiredInfoService) {

        this.routerChangeSubscription = this.routesListener.routeChangedEvent.subscribe((data)=>{

            if (data.segmentGroup){
                this.currentRoute = data.segmentsArr[0].path;
                this.queryString = this.route.snapshot.params['q'];

                if (this.currentRoute === 'explore' || this.currentRoute === 'my-tifos' || this.currentRoute === 'search'){

                    this.currentRoute === 'explore' && this.getSuggestedRooms();
                    this.currentRoute === 'my-tifos' && this.getUserRooms();
                    this.currentRoute === 'search' && this.getSearchableRooms(this.queryString)
                } else {

                    this.router.navigateByUrl('tifo/' + this.currentRoute)

                }
            } else {
                this.router.navigateByUrl('explore')
            }

        });
  }

  ngOnInit() {

  }

    ngOnDestroy() {

        this.routerChangeSubscription && this.routerChangeSubscription.unsubscribe()
    }



  getUserRooms(): void {

        this.show_loading = true;
        this.allRooms = [];

      this.requestService.getAllRooms().subscribe(
          data=>{
              if (data && data['rooms'] && data['rooms'].length){
                  this.show_loading = false;
                  this.allRooms = data['rooms'];
              }
          }, error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get rooms your from a server'})}
      );
  }

  getSearchableRooms(search: string): void {

      this.show_loading = true;
      this.allRooms = [];

      this.requestService.getRoomsBySearch(search).subscribe(
          data=>{
              //server output items by search and suggest, have different structure from user rooms.
              // addRequiredInfo service used to bring structure to same format
              this.show_loading = false;
              this.allRooms = this.addRequiredInfo.addInfo(data['rooms'])
          }, error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get searchable rooms from a server'})}
      );
  }

  getSuggestedRooms():void {

      this.show_loading = true;
      this.allRooms = [];

      this.requestService.getSuggestionRooms().subscribe(
          data=>{
              //server output items by search and suggest, have different structure from user rooms.
              // addRequiredInfo service used to bring structure to same format
              this.show_loading = false;
              this.allRooms = this.addRequiredInfo.addInfo(data['rooms'])
          }, error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get suggested rooms from a server'})}
      );
  }

    openNewRoomModal():void {

        const modalRef = this.modalService.open(CreateRoomComponent);
        modalRef.result.then((newRoom) => {
            this.allRooms.unshift(newRoom)
        }).catch(()=>{});
    }

}
