import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Routes, RouterModule} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FileDropModule } from 'angular2-file-drop';
import { DragulaModule } from 'ng2-dragula';
import {TimeAgoPipe} from 'time-ago-pipe';

import { AppComponent } from './app.component';
import { AllRoomsComponent } from './components/all-rooms/all-rooms.component';
import { InsideRoomComponent } from './components/inside-room/inside-room.component';
import { HeaderComponent } from './components/header/header.component';
import { RegistrationComponent } from './components/registration/registration.component';

import { CreatePostComponent } from './modals/create-post/create-post.component';
import { PostEditeComponent } from './modals/post-edite/post-edite.component';


import { RequestService } from './services/request.service';
import { EventsExchangeService } from './services/events-exchange.service';
import { UserStoreService } from './services/user-store.service';
import { ErrorShowService } from './services/error-show.service';
import { FileInfoService } from './services/file-info.service';
import { AddRequiredInfoService } from './services/add-required-info.service';

import { IeHeightDirective } from './directives/ie-height.directive';
import { LogInComponent } from './components/log-in/log-in.component';
import { CreateRoomComponent } from './modals/create-room/create-room.component';
import { CanActivateComponent } from './components/can-activate/can-activate.component';
import { PostDetailsComponent } from './modals/post-details/post-details.component';
import { RoomSettingsComponent } from './components/room-settings/room-settings.component';
import { UpdateRoomComponent } from './components/update-room/update-room.component';
import { AddWallComponent } from './components/add-wall/add-wall.component';
import { WallsListComponent } from './components/walls-list/walls-list.component';
import { EditWallComponent } from './components/edit-wall/edit-wall.component';
import { DeleteRoomComponent } from './components/delete-room/delete-room.component';
import { MembersListComponent } from './components/members-list/members-list.component';
import { NameFilterPipe } from './pipes/name-filter.pipe';
import { PrivateRoomComponent } from './modals/private-room/private-room.component';
import { SliderComponent } from './slider/slider.component';
import { ScroolEndDirective } from './directives/scrool-end.directive';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AboutUserComponent } from './components/about-user/about-user.component';
import { UsersRoomsInProfileComponent } from './components/users-rooms-in-profile/users-rooms-in-profile.component';
import { UsersPostsInProfileComponent } from './components/users-posts-in-profile/users-posts-in-profile.component';
import { UsersFansInProfileComponent } from './components/users-fans-in-profile/users-fans-in-profile.component';
import { UsersFavesInProfileComponent } from './components/users-faves-in-profile/users-faves-in-profile.component';
import { MutedBlockedComponent } from './components/muted-blocked/muted-blocked.component';
import { UsersDialogComponent } from './components/users-dialog/users-dialog.component';
import { UsersMessagesComponent } from './components/users-messages/users-messages.component';
import { ShowVisualMessagesComponent } from './components/show-visual-messages/show-visual-messages.component';
import { CanActivateRoomSettingsChildsComponent } from './components/can-activate-room-settings-childs/can-activate-room-settings-childs.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationsSettingsComponent } from './components/notifications-settings/notifications-settings.component';

let roomSettingsRoutes: Routes = [
  { path: 'edit-room', component: UpdateRoomComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: 'delete-room', component: DeleteRoomComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: 'add-wall', component: AddWallComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: 'edit-wall/:id', component: EditWallComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: 'walls-list', component: WallsListComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: 'members-list', component: MembersListComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: '',redirectTo: 'members-list', pathMatch:'full'}
];
let aboutUserChildRoutes = [
  { path: 'user-rooms', component: UsersRoomsInProfileComponent},
  { path: 'user-posts', component: UsersPostsInProfileComponent},
  { path: 'user-fans', component: UsersFansInProfileComponent},
  { path: 'user-faves', component: UsersFavesInProfileComponent},
  { path: '',redirectTo: 'user-rooms', pathMatch:'full'}
];

let userSettingsRoutes : Routes = [
  { path: 'edit-profile', component: EditProfileComponent},
  { path: 'change-password', component: ChangePasswordComponent},
  { path: 'muted-blocked', component: MutedBlockedComponent},
  { path: 'notifications-settings', component: NotificationsSettingsComponent},
  { path: '',redirectTo: 'edit-profile', pathMatch:'full'}
];

let appRoutes: Routes =[
  { path: 'room/:id', component: InsideRoomComponent, canActivate: [CanActivateComponent]},
  { path: 'all-rooms', component: AllRoomsComponent, canActivate: [CanActivateComponent]},
  { path: 'registration', component: RegistrationComponent},
  { path: 'login', component: LogInComponent},
  { path: 'room-settings', component: RoomSettingsComponent, children: roomSettingsRoutes, canActivate: [CanActivateComponent]},
  { path: 'user-settings', component: UserSettingsComponent, children: userSettingsRoutes, canActivate: [CanActivateComponent]},
  { path: 'about-user/:id', component: AboutUserComponent, children: aboutUserChildRoutes, canActivate: [CanActivateComponent]},
  { path: 'user-dialogs', component: UsersDialogComponent, canActivate: [CanActivateComponent]},
  { path: 'notifications', component: NotificationsComponent, canActivate: [CanActivateComponent]},
  { path: '**', redirectTo: 'all-rooms', pathMatch:'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    AllRoomsComponent,
    InsideRoomComponent,
    IeHeightDirective,
    HeaderComponent,
    RegistrationComponent,
    LogInComponent,
    CreatePostComponent,
    PostEditeComponent,
    CreateRoomComponent,
    CanActivateComponent,
    PostDetailsComponent,
    RoomSettingsComponent,
    UpdateRoomComponent,
    AddWallComponent,
    WallsListComponent,
    EditWallComponent,
    DeleteRoomComponent,
    MembersListComponent,
    NameFilterPipe,
    PrivateRoomComponent,
    SliderComponent,
    TimeAgoPipe,
    ScroolEndDirective,
    EditProfileComponent,
    UserSettingsComponent,
    ChangePasswordComponent,
    AboutUserComponent,
    UsersRoomsInProfileComponent,
    UsersPostsInProfileComponent,
    UsersFansInProfileComponent,
    UsersFavesInProfileComponent,
    MutedBlockedComponent,
    UsersDialogComponent,
    UsersMessagesComponent,
    ShowVisualMessagesComponent,
    CanActivateRoomSettingsChildsComponent,
    NotificationsComponent,
    NotificationsSettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    FileDropModule,
    DragulaModule
  ],
  providers: [
    RequestService,
    EventsExchangeService,
    UserStoreService,
    ErrorShowService,
    FileInfoService,
    CanActivateComponent,
    AddRequiredInfoService,
    CanActivateRoomSettingsChildsComponent
  ],
  entryComponents: [
    CreatePostComponent,
    PostEditeComponent,
    CreateRoomComponent,
    PostDetailsComponent,
    PrivateRoomComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
