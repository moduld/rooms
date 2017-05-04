import { Component, OnInit } from '@angular/core';

import {RequestService} from '../../services/request.service';
import {UserStoreService} from '../../services/user-store.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {

  error: any;

  constructor(private requestService : RequestService,  private storeservice: UserStoreService) { }

  userData: any;
  ngOnInit() {

  }

  logOut(){
    this.requestService.logOut().subscribe(
        data=>{
          console.log(data);
        },
        error => {
          this.error = error.json();
          console.log(this.error);
        }
    )
  }

}
