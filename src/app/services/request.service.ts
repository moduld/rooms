import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers, RequestOptions, Request} from '@angular/http';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {UserStoreService} from './user-store.service';

import { Room } from '../commonClasses/room';
import { Wall } from '../commonClasses/wall';
import { Post } from '../commonClasses/posts';
import { UserInfo } from '../commonClasses/userInfo';

@Injectable()
export class RequestService  {

  constructor(private http: Http, private storeservice: UserStoreService)  {}

  commonLink: string = 'http://test.tifoo.net/';
  userId: any = '567';
  token: string = '';
  roomId: any;
  headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  options: RequestOptions  = new RequestOptions({ headers: this.headers });

  getAllRooms(): Observable<Room[]> {
    this.addRequiredDataToTheService()
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);

    return this.http.get(this.commonLink + 'room/list', {headers: this.headers, search: params}).map((resp:Response)=>{
          return resp.json().rooms;
        })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  getWalls( room_id: any ): Observable<Wall> {

    this.roomId = room_id;

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_id', this.roomId);


    return this.http.get(this.commonLink + 'room/wall/list', {headers: this.headers, search: params}).map((resp:Response)=>{
      console.log(resp.json().room_walls)
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

  addRequiredDataToTheService(): void {
    let storedUserData = this.storeservice.getUserData();
    if (storedUserData){
      // this.userId = storedUserData['user_data']['user_id'];
      this.token = storedUserData['token'];
      this.headers.append('Authorization', "Bearer " + this.token);
      this.options = new RequestOptions({ headers: this.headers })

    }
    console.log(this.headers)
  }

  registration(user_data: any) : Observable<UserInfo> {

    return this.http.post(this.commonLink + 'user/register', JSON.stringify(user_data) , this.options).map((resp:Response)=>{
      this.storeservice.saveUserData(resp.json());
      this.addRequiredDataToTheService();
      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  logIn(user_data: any) : Observable<UserInfo> {

    return this.http.post(this.commonLink + 'user/login', JSON.stringify(user_data) , this.options).map((resp:Response)=>{
      this.storeservice.saveUserData(resp.json());
      this.addRequiredDataToTheService();
      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  logOut() : Observable<any> {

    return this.http.get(this.commonLink + 'user/logout', this.options).map((resp:Response)=>{
      this.storeservice.deleteUserData();
      return resp.json();
    })
        .catch((error: any)=> {
      return Observable.throw(error);
    });
  }

}
