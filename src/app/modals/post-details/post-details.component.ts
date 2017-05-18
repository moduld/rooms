import { Component, OnInit, Input, Output } from '@angular/core';

import { NgForm} from '@angular/forms';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { FileInfoService } from '../../services/file-info.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-post-details',
  templateUrl: 'post-details.component.html',
  styleUrls: ['post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  @Input() post;

  constructor(public activeModal: NgbActiveModal, private fileService: FileInfoService, private requestService: RequestService,) { }

  ngOnInit() {
    setTimeout(()=>{
      let modaldialog = document.querySelector('.modal-dialog');
      modaldialog.classList.add('modal_hi_width')
    })

  }

}
