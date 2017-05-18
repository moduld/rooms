import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Room } from '../commonClasses/room';


@Injectable()
export class EventsExchangeService {

  constructor() { }

  allRoomsChached: Room[] = [];
  currentRoomName: string;

  private emitChangeSource = new Subject<any>();
  private headerChangeSourse = new Subject<any>();

  changeEmitted = this.emitChangeSource.asObservable();
  changeHeaderViewEmitted = this.headerChangeSourse.asObservable();

  wallsToHeader(change: any):void {
    this.emitChangeSource.next(change);
  }

  changeHeaderView(flag: boolean): void {
    this.headerChangeSourse.next(flag);
  }


}
