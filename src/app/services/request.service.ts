import { Injectable } from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Room } from '../commonClasses/room';
import { Wall } from '../commonClasses/wall';
import { Post } from '../commonClasses/posts';

@Injectable()
export class RequestService {

  constructor(private http: Http) { }

  commonLink: string = 'http://test.tifoo.net/';
  userId: any = '567';
  roomId: any;

  getAllRooms(): Observable<Room[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);

    return this.http.get(this.commonLink + 'room/roomslist', {
      search: params
    }).map((resp:Response)=>{
          return resp.json().rooms;
        })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  getWalls( room_id: any ): Observable<Wall> {

    this.roomId = room_id;

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_id', this.roomId);


    return this.http.get(this.commonLink + 'room/room/wallslist', {
      search: params
    }).map((resp:Response)=>{
      return resp.json().room_walls;
    })
      .catch((error: any)=> { return Observable.throw(error);});
}

  getRoomPosts( wall_id: any ): Observable<Post[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_id', this.roomId);
    params.set('wall_id', wall_id);

    return this.http.get(this.commonLink + 'wall/post/getposts', {
      search: params
    }).map((resp:Response)=>{
      return resp.json().posts;
    }).catch((error: any)=> { return Observable.throw(error);});
  }

  registration(user_data: any) : any {
    return this.http.post(this.commonLink + 'room/room/wallslist',  user_data).map((resp:Response)=>{
      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }

}
