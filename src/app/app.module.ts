import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Routes, RouterModule} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FileDropModule } from 'angular2-file-drop';

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



let appRoutes: Routes =[
  { path: 'room/:id', component: InsideRoomComponent, canActivate: [CanActivateComponent]},
  { path: 'all-rooms', component: AllRoomsComponent, canActivate: [CanActivateComponent]},
  { path: 'registration', component: RegistrationComponent},
  { path: 'login', component: LogInComponent},
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
    CanActivateComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    FileDropModule
  ],
  providers: [
    RequestService,
    EventsExchangeService,
    UserStoreService,
    ErrorShowService,
    FileInfoService,
    CanActivateComponent
  ],
  entryComponents: [CreatePostComponent,
    PostEditeComponent,
    CreateRoomComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
