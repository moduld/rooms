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
  userId: any = '';
  token: string = '';
  roomId: any;
  headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  options: RequestOptions  = new RequestOptions({ headers: this.headers });

  addRequiredDataToTheService(): void {
    let storedUserData = this.storeservice.getUserData();
    if (storedUserData){
      this.userId = storedUserData['user_data']['user_id'];
      this.token = storedUserData['token'];
      if (this.headers.get('Authorization') === null){
        this.headers.append('Authorization', "Bearer " + this.token);
        this.options = new RequestOptions({ headers: this.headers })
      }
    }
  }

  getAllRooms(): Observable<Room[]> {

    !this.token && this.addRequiredDataToTheService();
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);

    let data = {
      params: params,
      apiLink: 'room/list'
    };

    return this.makeGetRequest(data)
  }

  getOnlyUsersRooms(dataToServer: any): Observable<Room[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('user_id_rooms', dataToServer);

    let data = {
      params: params,
      apiLink: 'room/user/list'
    };

    return this.makeGetRequest(data)
  }

  getUserDetails(dataToServer: any): Observable<Room[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('user_id_details', dataToServer);

    let data = {
      params: params,
      apiLink: 'user/get/details'
    };

    return this.makeGetRequest(data)
  }

  getOnlyUsersPosts(dataToServer: any): Observable<Room[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('user_id_post', dataToServer.user_id_post);
    params.set('offset_id', dataToServer.offset_id);
    params.set('direction_flag', dataToServer.direction_flag );

    let data = {
      params: params,
      apiLink: 'wall/post/get/user'
    };

    return this.makeGetRequest(data)
  }

  getUsersFans(dataToServer: any): Observable<Room[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id_profile', dataToServer.user_id);
    params.set('user_id_last', dataToServer.user_id_last );

    let data = {
      params: params,
      apiLink: 'user/get/fans'
    };

    return this.makeGetRequest(data)
  }

  getUsersFaves(dataToServer: any): Observable<Room[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id_profile', dataToServer.user_id);
    params.set('user_id_last', dataToServer.user_id_last );

    let data = {
      params: params,
      apiLink: 'user/get/faves'
    };

    return this.makeGetRequest(data)
  }

  getMutedOrBlockedUsersList(dataToServer: any): Observable<Room[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('user_id_last', dataToServer.user_id_last );

    let data = {
      params: params,
      apiLink: dataToServer.flag === 'muted' ? 'user/get/mutes' : 'user/get/blocks'
    };

    return this.makeGetRequest(data)
  }

  getSuggestionRooms(): Observable<Room[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);

    let data = {
      params: params,
      apiLink: 'room/suggest'
    };

    return this.makeGetRequest(data)
  }

  getRoomsBySearch(search: string): Observable<Room[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('search_term', search);

    let data = {
      params: params,
      apiLink: 'room/search'
    };

    return this.makeGetRequest(data)
  }

  getWalls( room_id: any ): Observable<Wall> {

    !this.token && this.addRequiredDataToTheService();
    this.roomId = room_id;

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_id', this.roomId);

    let data = {
      params: params,
      apiLink: 'room/wall/list'
    };

    return this.makeGetRequest(data)
}

  getRoomPosts( wall_id: any ): Observable<Post[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_id', this.roomId);
    params.set('wall_id', wall_id);

    let data = {
      params: params,
      apiLink: 'wall/post/get/all'
    };

    return this.makeGetRequest(data)
  }

  getPostComments( dataToServer: any ): Observable<Post[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('post_id', dataToServer.post_id);
    params.set('offset_id', dataToServer.offset);
    let direction = dataToServer.order_by === 'date_newer' ? '0' : '1';
    params.set('direction_flag', direction);
    params.set('order_by', dataToServer.order_by);

    let data = {
      params: params,
      apiLink: 'wall/comment/get/all'
    };

    return this.makeGetRequest(data)
  }

  getRoomMembers(dataToServer: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_id', this.roomId);
    params.set('member_type', dataToServer.member_type);
    params.set('user_id_last ', dataToServer.member_type);

    let data = {
      params: params,
      apiLink: 'room/member/list'
    };

    return this.makeGetRequest(data)
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

  blockOrMuteUser(dataToServer: any): Observable<any> {

    let sendData = {
      user_id: this.userId
    };
    sendData['user_id_' + dataToServer.user_interract_key] = dataToServer.user_interract_id;
    sendData[dataToServer.user_interract_key] = dataToServer.flag;

    let data = {
      sendData: sendData,
      apiLink: 'user/' + dataToServer.user_interract_key
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

  userToBan(obj: any): Observable<any>{
    let sendData = {
      user_id: this.userId,
      room_id: obj.room_id,
      user_id_member: obj.owner.user_id,
      ban_days: obj.ban_days
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

    let data = {
      params: params,
      apiLink: 'getSignedURL'
    };

    return this.makeGetRequest(data)
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

  updateMembership(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      room_id: dataToServer.room_id,
      user_id_member: dataToServer.user_id_member,
      member_type: dataToServer.membership_type,
      member_type_val: dataToServer.member_type_val
    };

    let data = {
      sendData: sendData,
      apiLink: 'room/member/update'
    };

    return this.makePostRequest(data)
  }

  createNewComment(dataToServer: any): Observable<any> {
    let sendData = {
      user_id: this.userId,
      room_id: dataToServer.post.room_id,
      wall_id: dataToServer.post.wall_id,
      post_id: dataToServer.post.post_id,
      text: dataToServer.text,
      media: dataToServer.media
    };

    let data = {
      sendData: sendData,
      apiLink: 'wall/comment/new'
    };

    return this.makePostRequest(data)
  }

  commentLike(dataToServer: any): Observable<any> {

    let sendData = {
      user_id: this.userId,
      comment_id: dataToServer.comment_id,
      like: dataToServer.like
    };

    let data = {
      sendData: sendData,
      apiLink: 'wall/comment/like'
    };

    return this.makePostRequest(data)
  }

  commentDelete(dataToServer: any): Observable<any> {

    let sendData = {
      user_id: this.userId,
      comment_id: dataToServer.comment_id,
      post_id: dataToServer.post_id,
      room_id: dataToServer.room_id
    };

    let data = {
      sendData: sendData,
      apiLink: 'wall/comment/remove'
    };

    return this.makePostRequest(data)
  }

  commentReport(dataToServer: any): Observable<any> {

    let sendData = {
      user_id: this.userId,
      comment_id: dataToServer.comment_id
    };

    let data = {
      sendData: sendData,
      apiLink: 'wall/comment/report'
    };

    return this.makePostRequest(data)
  }

  editUserProfile(dataToServer: any): Observable<any> {

    let sendData = {
      user_id: this.userId,
      about: dataToServer.userData.about,
      display_name: dataToServer.userData.display_name,
      msg_from_anyone: dataToServer.userData.msg_from_anyone ? 1 : 0,
      user_name: dataToServer.userData.user_name,
      multimedia: dataToServer.multimedia
    };

    let data = {
      sendData: sendData,
      apiLink: 'user/update/profile'
    };

    return this.makePostRequest(data)
  }

  faveUnfaveUser(dataToServer: any): Observable<any> {

    let sendData = {
      user_id: this.userId,
      user_id_fave: dataToServer.user_id_fave,
      fave: dataToServer.is_fave ? 0 : 1
    };

    let data = {
      sendData: sendData,
      apiLink: 'user/fave'
    };

    return this.makePostRequest(data)
  }

  makePostRequest(data: any): Observable<any> {

    return this.http.post(this.commonLink + data.apiLink, JSON.stringify(data.sendData), this.options).map((resp:Response)=>{

      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  makeGetRequest(data: any): Observable<any> {

    return this.http.get(this.commonLink + data.apiLink, {headers: this.headers, search: data.params})
        .map((resp:Response)=>{
      return resp.json();
    })
        .catch((error: any)=>{
      return Observable.throw(error);
    });
  }
}
