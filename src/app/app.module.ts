import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Routes, RouterModule} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FileDropModule } from 'angular2-file-drop';
import { DragulaModule } from 'ng2-dragula';

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

let settingsRoutes: Routes = [
  { path: 'edit-room', component: UpdateRoomComponent},
  { path: 'delete-room', component: DeleteRoomComponent},
  { path: 'add-wall', component: AddWallComponent},
  { path: 'edit-wall/:id', component: EditWallComponent},
  { path: 'walls-list', component: WallsListComponent},
  { path: 'members-list', component: MembersListComponent}
];

let appRoutes: Routes =[
  { path: 'room/:id', component: InsideRoomComponent, canActivate: [CanActivateComponent]},
  { path: 'all-rooms', component: AllRoomsComponent, canActivate: [CanActivateComponent]},
  { path: 'registration', component: RegistrationComponent},
  { path: 'login', component: LogInComponent},
  { path: 'room-settings', component: RoomSettingsComponent, children: settingsRoutes},
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
    CanActivateComponent
  ],
  entryComponents: [
    CreatePostComponent,
    PostEditeComponent,
    CreateRoomComponent,
    PostDetailsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
