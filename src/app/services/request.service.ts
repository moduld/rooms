import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers, RequestOptions, Jsonp, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Router} from '@angular/router';

import {UserStoreService} from './user-store.service';


@Injectable()
export class RequestService  {

  constructor(private http: Http,
              private _jsonp: Jsonp,
              private router: Router,
              private storeservice: UserStoreService)  {}

  commonLink: string = 'http://dev.tifos.net/';
  userId: any = '';
  token: string = '';
  roomId: any;
  headers: Headers = new Headers({ 'Content-Type': 'application/json', 'AppKey': 'abcd1234', 'AppVersion': 'Tifo 1.0', 'x-public': 'Angular', 'OS': 'NodeJs'});
  options: RequestOptions  = new RequestOptions({ headers: this.headers });

  // this method runs from app.component onInit, and from logIn, logOut and registration methods in this service
  addRequiredDataToTheService(user?:any): void {

    user && this.storeservice.saveUserData(user);

    let storedUserData = this.storeservice.getUserData();
    !storedUserData && this.setGuestUser();
    this.setServiceVariables()
  }

  setServiceVariables():void {

    this.headers.delete('Authorization');
    this.token = '';

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

  setGuestUser():void {

    let user = {
      token: 'guest',
      user_data: {
        about: "",
        active: 0,
        created_at: new Date(),
        display_name: "guest",
        fans_count: 0,
        faves_count: 0,
        msg_from_anyone: 0,
        multimedia: "",
        posts_count: 0,
        rooms_count: 0,
        thumbnail: "",
        updated_at: "",
        user_id: 0,
        user_name: "guest"
      }
    };

    this.storeservice.saveUserData(user)
  }

  getAllRooms(): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);

    let data = {
      params: params,
      apiLink: 'room/list'
    };

    return this.makeGetRequest(data)
  }

  getOnlyUsersRooms(dataToServer: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('user_id_rooms', dataToServer);

    let data = {
      params: params,
      apiLink: 'room/user/list'
    };

    return this.makeGetRequest(data)
  }

  getUserDetails(dataToServer: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('user_id_details', dataToServer);

    let data = {
      params: params,
      apiLink: 'user/get/details'
    };

    return this.makeGetRequest(data)
  }

  getUserMessages(dataToServer: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('user_id_to', dataToServer.user_id_to);
    params.set('offset_id', dataToServer.offset_id );
    params.set('direction_flag', dataToServer.direction_flag );

    let data = {
      params: params,
      apiLink: 'message/user/msgs'
    };

    return this.makeGetRequest(data)
  }

  getOnlyUsersPosts(dataToServer: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    dataToServer.user_id_post && params.set('user_id_post', dataToServer.user_id_post);
    params.set('offset_id', dataToServer.offset_id);
    params.set('direction_flag', dataToServer.direction_flag);
    dataToServer.user_name_post && params.set('user_name_post', dataToServer.user_name_post);
    dataToServer.wall_id && params.set('wall_id', dataToServer.wall_id);
    dataToServer.room_id  && params.set('room_id', dataToServer.room_id);

    let data = {
      params: params,
      apiLink: 'wall/post/get/user'
    };

    return this.makeGetRequest(data)
  }

  getPostsBySearchText(dataToServer: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('offset_id', dataToServer.offset_id);
    params.set('direction_flag', dataToServer.direction_flag );
    params.set('search_term', dataToServer.user_name_post);
    params.set('wall_id', dataToServer.wall_id);
    params.set('room_id', dataToServer.room_id);

    let data = {
      params: params,
      apiLink: 'wall/post/search'
    };

    return this.makeGetRequest(data)
  }

  getPostsById(post_id: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('post_id', post_id);


    let data = {
      params: params,
      apiLink: 'wall/post/get/one'
    };

    return this.makeGetRequest(data)
  }

  getUserNotifications(dataToServer: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('type', dataToServer.type);
    params.set('offset_id', dataToServer.offset_id);
    params.set('direction_flag', dataToServer.direction_flag );
    params.set('new', dataToServer.new );

    let data = {
      params: params,
      apiLink: 'user/get/notifications'
    };

    return this.makeGetRequest(data)
  }

  getUserNotificationsSettings(): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);

    let data = {
      params: params,
      apiLink: 'user/notification/settings/get'
    };

    return this.makeGetRequest(data)
  }

  getUserDialogUsersList(): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);

    let data = {
      params: params,
      apiLink: 'message/users'
    };

    return this.makeGetRequest(data)
  }

  getUsersFans(dataToServer: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id_profile', dataToServer.user_id);
    params.set('user_id_last', dataToServer.user_id_last );

    let data = {
      params: params,
      apiLink: 'user/get/fans'
    };

    return this.makeGetRequest(data)
  }

  getUsersFaves(dataToServer: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id_profile', dataToServer.user_id);
    params.set('user_id_last', dataToServer.user_id_last );

    let data = {
      params: params,
      apiLink: 'user/get/faves'
    };

    return this.makeGetRequest(data)
  }

  getMutedOrBlockedUsersList(dataToServer: any): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('user_id_last', dataToServer.user_id_last );

    let data = {
      params: params,
      apiLink: dataToServer.flag === 'muted' ? 'user/get/mutes' : 'user/get/blocks'
    };

    return this.makeGetRequest(data)
  }

  getSuggestionRooms(): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);

    let data = {
      params: params,
      apiLink: 'room/suggest'
    };

    return this.makeGetRequest(data)
  }

  getRoomsBySearch(search: string): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('search_term', search);

    let data = {
      params: params,
      apiLink: 'room/search'
    };

    return this.makeGetRequest(data)
  }

  getWalls( room_alias: any ): Observable<any> {

    // this.roomId = room_id;
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_alias', room_alias);

    let data = {
      params: params,
      apiLink: 'room/wall/list'
    };

    return this.makeGetRequest(data)
}

  getRoomPosts( dataToServer: any ): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_id', dataToServer.room_id);
    params.set('wall_id', dataToServer.wall_id);
    params.set('offset_id', dataToServer.offset_id);
    params.set('direction_flag', '0');

    let data = {
      params: params,
      apiLink: 'wall/post/get/all'
    };

    return this.makeGetRequest(data)
  }

  getFavedRoomsPosts( dataToServer: any ): Observable<any[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);
    params.set('room_id', dataToServer.room_id);
    params.set('wall_id', dataToServer.wall_id);
    params.set('offset_id', dataToServer.offset_id);
    params.set('direction_flag', '0');

    let data = {
      params: params,
      apiLink: 'wall/post/get/faves'
    };

    return this.makeGetRequest(data)
  }

  getPostComments( dataToServer: any ): Observable<any[]> {

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
    params.set('room_id', dataToServer.room_id);
    params.set('member_type', dataToServer.member_type);
    params.set('user_id_last', dataToServer.user_id_last);

    let data = {
      params: params,
      apiLink: 'room/member/list'
    };

    return this.makeGetRequest(data)
  }

  getNotificationSettings(): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', this.userId);

    let data = {
      params: params,
      apiLink: 'user/notification/settings/get'
    };

    return this.makeGetRequest(data)
  }

  registration(user_data: any) : Observable<any> {

    this.addTimeToHeaders();

    return this.http.post(this.commonLink + 'user/register', JSON.stringify(user_data) , this.options).map((resp:Response)=>{

      this.addRequiredDataToTheService(resp.json());
      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  logIn(user_data: any) : Observable<any> {

    this.addTimeToHeaders();

    return this.http.post(this.commonLink + 'user/login', JSON.stringify(user_data) , this.options).map((resp:Response)=>{

      this.addRequiredDataToTheService(resp.json());
      return resp.json();
    })
        .catch((error: any)=> { return Observable.throw(error);});
  }

  logOut() : Observable<any> {

    this.addTimeToHeaders();

    return this.http.get(this.commonLink + 'user/logout', this.options).map((resp:Response)=>{

      this.setGuestUser();
      this.addRequiredDataToTheService();

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
      multimedia: dataToServer.multimedia,
      tags: dataToServer.roomData.tags
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
      room_id: dataToServer.room_id
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
      room_alias: dataToServer.roomData.room_alias,
      room_desc: dataToServer.roomData.room_desc,
      searchable_flag: dataToServer.roomData.searchable_flag ? 1 : 0,
      multimedia: dataToServer.multimedia,
      tags: dataToServer.roomData.tags
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

  sendNewMessage(dataToServer: any): Observable<any> {

    let sendData = {
      user_id: this.userId,
      user_id_to: dataToServer.user_id_to,
      text: dataToServer.text,
      media: dataToServer.media
    };

    let data = {
      sendData: sendData,
      apiLink: 'message/new'
    };

    return this.makePostRequest(data)
  }

  saveNotificationsSettings(dataToServer: any): Observable<any> {

    let sendData = {
      user_id: this.userId,
      notification_settings: dataToServer.notification_settings
    };

    let data = {
      sendData: sendData,
      apiLink: 'user/notification/settings/update'
    };

    return this.makePostRequest(data)
  }

  deleteMessage(dataToServer: any): Observable<any> {

    let sendData = {
      user_id: this.userId,
      msg_id: dataToServer.msg_id
    };

    let data = {
      sendData: sendData,
      apiLink: 'message/remove'
    };

    return this.makePostRequest(data)
  }

  changePassword(dataToServer: any): Observable<any> {

    let sendData = {
      user_id: this.userId,
      old_password: dataToServer.old_password,
      new_password: dataToServer.new_password
    };

    let data = {
      sendData: sendData,
      apiLink: 'user/password/change'
    };

    return this.makePostRequest(data)
  }

  makePostRequest(data: any): Observable<any> {

    this.addTimeToHeaders();

    return this.http.post(this.commonLink + data.apiLink, JSON.stringify(data.sendData), this.options).map((resp:Response)=>{

      return resp.json();
    })
        .catch((error: any)=> {
          error.json().message && error.json().message == 'token_not_authorized' && this.router.navigateByUrl('/login');
      return Observable.throw(error.json());});
  }

  makeGetRequest(data: any): Observable<any> {

    this.addTimeToHeaders();

    return this.http.get(this.commonLink + data.apiLink, {headers: this.headers, search: data.params})
        .map((resp:Response)=>{
      return resp.json();
    })
        .catch((error: any)=>{
          error.json().message && error.json().message == 'token_not_authorized' && this.router.navigateByUrl('/login');

      return Observable.throw(error.json());
    });
  }

  addTimeToHeaders(): void {

    this.headers.delete('x-time');
    let time = (new Date().getTime()/1000).toFixed(0);
    this.headers.append('x-time', time);
  }

  getLinkPreview(link: any): Observable<any> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('key', '595c803f2930c4467c5ebcc8206601625e713d31605f9');
    params.set('q', link.url);
    params.set('format', 'json');
    params.set('callback', "JSONP_CALLBACK");

    return this._jsonp.get('http://api.linkpreview.net/', {search: params})
        .map((resp:Response)=>{
          let temp = resp.json();
          temp.message_id = link.message_id;
          return temp
        })
        .catch((error: any)=>{
          return Observable.throw(error.json());
        });
  }


}
