import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, UrlSegmentGroup, UrlTree, PRIMARY_OUTLET, UrlSegment, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';
import { AddRequiredInfoService } from '../../services/add-required-info.service';
import {UserStoreService} from '../../services/user-store.service';

import { Room } from '../../commonClasses/room';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {CreateRoomComponent} from '../../modals/create-room/create-room.component';


@Component({
  selector: 'app-all-rooms',
  templateUrl: 'all-rooms.component.html',
  styleUrls: ['all-rooms.component.scss']
})
export class AllRoomsComponent implements OnInit, OnDestroy {

    error: any;
    allRooms: Room[] = [];
    show_loading:boolean;
    routerSubscription: any;
    currentRoute: string;
    queryString: string;

    constructor(private requestService: RequestService,
                private modalService: NgbModal,
                private router: Router,
                private route: ActivatedRoute,
                private exchangeService: EventsExchangeService,
                private addRequiredInfo: AddRequiredInfoService,
                private storeservice: UserStoreService) {

      // exchangeService.makeHeaderRoomSearch.subscribe(
      //     search => {
      //         this.getSearchableRooms(search)
      //     });

        // exchangeService.makeHeaderRoomSuggestRequest.subscribe(
        //     (flag) => {
        //             flag === 'suggested' ? this.getSuggestedRooms() : this.getUserRooms()
        //     })

        this.routerSubscription = this.router.events.subscribe(event=>{

            if (event instanceof NavigationEnd ){
                let parses: UrlTree = this.router.parseUrl(this.router.url);
                let segmentGroup: UrlSegmentGroup = parses.root.children[PRIMARY_OUTLET];
                if (segmentGroup){
                let segments: UrlSegment[] = segmentGroup.segments;
                this.currentRoute = segments[0].path;
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
            }
        })

  }

  ngOnInit() {
        //if default rooms output was changed to search or my rooms, and then user went to another page
        //when he comes to all-rooms page, this check returns previous state(search or my rooms)
        // if (this.storeservice.getSearchText()){
        //     this.getSearchableRooms(this.storeservice.getSearchText())
        // } else {
        //     this.storeservice.getSuggestedOrDefault() === 'suggested' && this.getSuggestedRooms();
        //     this.storeservice.getSuggestedOrDefault() === 'default' && this.getUserRooms();
        //     !this.storeservice.getSuggestedOrDefault() && this.getSuggestedRooms()
        // }
  }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }



  getUserRooms(): void {

        this.show_loading = true;
        this.allRooms = [];

      this.requestService.getAllRooms().subscribe(
          data=>{
              for(let i = 0; i < data['rooms'].length; i++){
                  //this cycle need to remove broken items which can come from server
                  if (!data['rooms'][i].room || !data['rooms'][i].room_id){
                      data['rooms'].splice(i, 1)
                  }
              }
              this.show_loading = false;
              this.allRooms = data['rooms'];
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
