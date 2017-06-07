import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-settings',
  templateUrl: 'user-settings.component.html',
  styleUrls: ['user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  menu_show_toggle: boolean;

  constructor() { }

  ngOnInit() {
    this.menu_show_toggle = true;

  }

}
