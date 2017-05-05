import { Component, OnInit} from '@angular/core';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-post',
  templateUrl: 'create-post.component.html',
  styleUrls: ['create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }


}
