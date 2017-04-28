import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Routes, RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { AllRoomsComponent } from './components/all-rooms/all-rooms.component';
import { InsideRoomComponent } from './components/inside-room/inside-room.component';

import { RequestService } from './services/request.service';
import { EventsExchangeService } from './services/events-exchange.service';
import { IeHeightDirective } from './directives/ie-height.directive';
import { HeaderComponent } from './components/header/header.component';

let appRoutes: Routes =[
  { path: 'room/:id', component: InsideRoomComponent},
  { path: '', component: AllRoomsComponent, pathMatch:'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    AllRoomsComponent,
    InsideRoomComponent,
    IeHeightDirective,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    RequestService,
    EventsExchangeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
