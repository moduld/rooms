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

      return resp.json().room_walls;
    })
      .catch((error: any)=> { return Observable.throw(error);});
}

  getRoomPosts( wall_id: any ): Observable<Post[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_id', this.roomId);
    params.set('wall_id', wall_id);

    return this.http.get(this.commonLink + 'wall/post/get/all', {
      search: params
    }).map((resp:Response)=>{
      return resp.json().posts;
    }).catch((error: any)=> { return Observable.throw(error);});

  }

  addRequiredDataToTheService(): void {
    let storedUserData = this.storeservice.getUserData();
    if (storedUserData){
      console.log(storedUserData)
      // this.userId = storedUserData['user_data']['user_id'];
      this.token = storedUserData['token'];
      this.headers.append('Authorization', "Bearer " + this.token);
      this.options = new RequestOptions({ headers: this.headers })

    }

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

  postInteractionUser(user_interract_key: string, user_interract_id: number, flag_key: string, flag: number): Observable<any> {

    let sendData = {
      user_id: this.userId
    };
    sendData['user_id_' + user_interract_key] = user_interract_id;
    sendData[flag_key] = flag;
  return this.http.post(this.commonLink + 'user/' + user_interract_key, JSON.stringify(sendData), this.options).map((resp:Response)=>{

    return resp.json();
  })
      .catch((error: any)=> { return Observable.throw(error);});
}

  postDelete(post_id: number, room_id: number): Observable<any> {

    let sendData = {
      user_id: this.userId,
      post_id: post_id,
      room_id: room_id
    };
    return this.http.post(this.commonLink + 'wall/post/remove', JSON.stringify(sendData), this.options).map((resp:Response)=>{

      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  postLikeAndUnlike(post_id, flag): Observable<any>{
    let sendData = {
      user_id: this.userId,
      post_id: post_id,
      like: flag ? 0 : 1
    };
    return this.http.post(this.commonLink + 'wall/post/like', JSON.stringify(sendData), this.options).map((resp:Response)=>{

      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  getLinkForFileUpload(settings: any): Observable<any>{

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('folder', settings.folder);
    params.set('content_type', settings.content_type);
    params.set('ext', settings.ext);
    params.set('num_urls', '1');

    return this.http.get(this.commonLink + 'getSignedURL', {search: params}).map((resp:Response)=>{
      return resp.json();
    }).catch((error: any)=> { return Observable.throw(error);});
  }

  fileUpload(settings: any): Observable<any>{

    let headers: Headers = new Headers({ 'Content-Type': settings.content_type });
    let options: RequestOptions  = new RequestOptions({ headers: headers });

    return this.http.put(settings.link, settings.file, options).map((resp:Response)=>{
      settings.multimedia = settings.link.split('?')[0];
      return settings
    }).catch((error: any)=> { return Observable.throw(error);});
  }

  createNewPost(wall_id: number, room_id: number, dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      wall_id: wall_id,
      room_id: room_id,
      text: dataToServer.text
    };
    dataToServer.media ? sendData['media'] = dataToServer.media : '';
    dataToServer.poll ?  sendData['poll'] = dataToServer.poll : '';

    return this.http.post(this.commonLink + 'wall/post/new', JSON.stringify(sendData), this.options).map((resp:Response)=>{

      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  editePost(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      post_id: dataToServer.post_id,
      text: dataToServer.text,
      media: dataToServer.media
    };
    console.log(dataToServer)
    return this.http.post(this.commonLink + 'wall/post/edit', JSON.stringify(sendData), this.options).map((resp:Response)=>{

      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }
}
