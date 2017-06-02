import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-muted-blocked',
  templateUrl: 'muted-blocked.component.html',
  styleUrls: ['muted-blocked.component.scss']
})
export class MutedBlockedComponent implements OnInit {

  member_toggler: string;
  constructor() { }

  ngOnInit() {
    this.member_toggler = 'muted'
  }

  memberTypeChanged(state: string): void {

  }

}
