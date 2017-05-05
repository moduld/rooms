import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Routes, RouterModule} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AllRoomsComponent } from './components/all-rooms/all-rooms.component';
import { InsideRoomComponent } from './components/inside-room/inside-room.component';
import { HeaderComponent } from './components/header/header.component';
import { RegistrationComponent } from './components/registration/registration.component';

import { CreatePostComponent } from './modals/create-post/create-post.component';


import { RequestService } from './services/request.service';
import { EventsExchangeService } from './services/events-exchange.service';
import { UserStoreService } from './services/user-store.service';
import { ErrorShowService } from './services/error-show.service';

import { IeHeightDirective } from './directives/ie-height.directive';
import { LogInComponent } from './components/log-in/log-in.component';



let appRoutes: Routes =[
  { path: 'room/:id', component: InsideRoomComponent},
  { path: 'all-rooms', component: AllRoomsComponent},
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
    CreatePostComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot()
  ],
  providers: [
    RequestService,
    EventsExchangeService,
    UserStoreService,
    ErrorShowService
  ],
  entryComponents: [CreatePostComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
