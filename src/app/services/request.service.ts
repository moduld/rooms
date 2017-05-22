import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers, RequestOptions, Request} from '@angular/http';
import {Location} from '@angular/common';
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

  constructor(private http: Http, private storeservice: UserStoreService, private location: Location)  {}

  commonLink: string = 'http://dev.tifos.net/';
  // userId: any = '567';
  userId: any = '';
  token: string = '';
  roomId: any;
  headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  options: RequestOptions  = new RequestOptions({ headers: this.headers });

  getAllRooms(): Observable<Room[]> {
    !this.token && this.addRequiredDataToTheService();
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);

    return this.http.get(this.commonLink + 'room/list', {headers: this.headers, search: params}).map((resp:Response)=>{
          return resp.json().rooms;
        })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  getWalls( room_id: any ): Observable<Wall> {
    !this.token && this.addRequiredDataToTheService();
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

    return this.http.get(this.commonLink + 'wall/post/get/all', {headers: this.headers, search: params}).map((resp:Response)=>{
      return resp.json().posts;
    }).catch((error: any)=> { return Observable.throw(error);});

  }

  getRoomMembers(member_type: string): Observable<any[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_id', this.roomId);
    params.set('member_type', member_type);

    return this.http.get(this.commonLink + 'room/member/list', {headers: this.headers, search: params}).map((resp:Response)=>{
      return resp.json();
    }).catch((error: any)=> { return Observable.throw(error);});

  }

  addRequiredDataToTheService(): void {
    let storedUserData = this.storeservice.getUserData();
    if (storedUserData){
      console.log(storedUserData)
      this.userId = storedUserData['user_data']['user_id'];
      this.token = storedUserData['token'];
      if (this.headers.get('Authorization') === null){
        this.headers.append('Authorization', "Bearer " + this.token);
        this.options = new RequestOptions({ headers: this.headers })
      }
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
      this.headers.delete('Authorization');
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

    let data = {
      sendData: sendData,
      apiLink: 'user/' + user_interract_key
    };

    return this.makePostRequest(data)
}

  postDelete(post_id: number, room_id: number): Observable<any> {

    let sendData = {
      user_id: this.userId,
      post_id: post_id,
      room_id: room_id
    };
    let data = {
      sendData: sendData,
      apiLink: 'wall/post/remove'
    };

    return this.makePostRequest(data)
  }

  postLikeAndUnlike(post_id, flag): Observable<any>{
    let sendData = {
      user_id: this.userId,
      post_id: post_id,
      like: flag ? 0 : 1
    };
    let data = {
      sendData: sendData,
      apiLink: 'wall/post/like'
    };

    return this.makePostRequest(data)
  }

  postInappropriate(post_id): Observable<any>{
    let sendData = {
      user_id: this.userId,
      post_id: post_id,
    };
    let data = {
      sendData: sendData,
      apiLink: 'wall/post/report'
    };

    return this.makePostRequest(data)
  }

  userToBan(post: any): Observable<any>{
    let sendData = {
      user_id: this.userId,
      room_id: post.room_id,
      user_id_member: post.owner.user_id,
      ban_days: post.ban_days
    };
    let data = {
      sendData: sendData,
      apiLink: 'room/member/ban'
    };

    return this.makePostRequest(data)
  }

  movePost(post: any): Observable<any>{
    let sendData = {
      user_id: this.userId,
      post_id: post.post_id,
      room_id: post.room_id,
      wall_id: post.move_to_wall_id

    };

    let data = {
      sendData: sendData,
      apiLink: 'wall/post/move'
    };

    return this.makePostRequest(data)
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
      text: dataToServer.text,
      allow_comment_flag: dataToServer.allow_comment_flag
    };
    dataToServer.media ? sendData['media'] = dataToServer.media : '';
    dataToServer.poll ?  sendData['poll'] = dataToServer.poll : '';

    let data = {
      sendData: sendData,
      apiLink: 'wall/post/new'
    };

    return this.makePostRequest(data)
  }

  editePost(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      post_id: dataToServer.post_id,
      text: dataToServer.text,
      media: dataToServer.media
    };
    let data = {
      sendData: sendData,
      apiLink: 'wall/post/edit'
    };

    return this.makePostRequest(data)
  }

  createNewRoom(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      room_name: dataToServer.roomData.room_name,
      room_desc: dataToServer.roomData.room_desc,
      searchable_flag: dataToServer.roomData.searchable_flag ? 1 : 0,
      multimedia: dataToServer.multimedia
    };
    sendData['public'] = dataToServer.roomData.public ? 1 : 0;

    let data = {
      sendData: sendData,
      apiLink: 'room/create'
    };

    return this.makePostRequest(data)
  }

  joinAndLeaveRoom(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      room_id: dataToServer.room_details.room_id
    };

    let data = {
      sendData: sendData
    };
    dataToServer.flag === 'join' ? data['apiLink'] = 'room/join' : '';
    dataToServer.flag === 'leave' ? data['apiLink'] = 'room/leave' : '';

    return this.makePostRequest(data)
  }


  updateRoom(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      room_id: dataToServer.room_id,
      room_name: dataToServer.roomData.room_name,
      room_desc: dataToServer.roomData.room_desc,
      searchable_flag: dataToServer.roomData.searchable_flag ? 1 : 0,
      multimedia: dataToServer.multimedia
    };
    sendData['public'] = dataToServer.roomData.public ? 1 : 0;

    let data = {
      sendData: sendData,
      apiLink: 'room/update'
    };

    return this.makePostRequest(data)
  }

  votePost(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      poll_id: dataToServer.poll.poll_id,
      choice: dataToServer.voted_data,
      room_id: dataToServer.room_id
    };

    let data = {
      sendData: sendData,
      apiLink: 'wall/poll/vote'
    };

    return this.makePostRequest(data)
  }

  deleteRoom(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      room_id: dataToServer
    };

    let data = {
      sendData: sendData,
      apiLink: 'room/remove'
    };

    return this.makePostRequest(data)
  }

  newWall(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      room_id: dataToServer.room_id,
      wall_name: dataToServer.wall_name
    };
    sendData['allow_post_flag'] = dataToServer.allow_post_flag ? 1 : 0;
    sendData['allow_comment_flag'] = dataToServer.allow_comment_flag ? 1 : 0;

    let data = {
      sendData: sendData,
      apiLink: 'room/wall/add'
    };

    return this.makePostRequest(data)
  }

  deleteWall(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      room_id: dataToServer.room_id,
      wall_id: dataToServer.wall_id
    };

    let data = {
      sendData: sendData,
      apiLink: 'room/wall/remove'
    };

    return this.makePostRequest(data)
  }

  updateWall(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      room_id: dataToServer.room_id,
      wall_id: dataToServer.wall_id,
      wall_name: dataToServer.wall_name,
      allow_post_flag: dataToServer.allow_post_flag ? 1 : 0,
      allow_comment_flag: dataToServer.allow_comment_flag ? 1 : 0
    };

    let data = {
      sendData: sendData,
      apiLink: 'room/wall/update'
    };

    return this.makePostRequest(data)
  }

  changeWallOrder(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      room_id: dataToServer.room_id,
      walls_order: dataToServer.walls_order
    };

    let data = {
      sendData: sendData,
      apiLink: 'room/wall/order'
    };

    return this.makePostRequest(data)
  }


  makePostRequest(data: any): Observable<any> {

    return this.http.post(this.commonLink + data.apiLink, JSON.stringify(data.sendData), this.options).map((resp:Response)=>{

      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }
}
