import { Component, OnInit, Input, Output } from '@angular/core';

import { NgForm} from '@angular/forms';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { FileInfoService } from '../../services/file-info.service';
import { RequestService } from '../../services/request.service';
import { SliderComponent } from '../../slider/slider.component';

@Component({
  selector: 'app-post-details',
  templateUrl: 'post-details.component.html',
  styleUrls: ['post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  @Input() post;
  error: any;
  mediaToAppServer: any;
  inProcess: boolean;
  dataToServer: any = {};
  textField: string = '';
  postComments: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private fileService: FileInfoService,
              private requestService: RequestService,) { }

  ngOnInit() {
    console.log(this.post)
    setTimeout(()=>{
      let modaldialog = document.querySelector('.modal-dialog');
      this.post.media && this.post.media.length ? modaldialog.classList.add('post_details_modal_hi_width') : modaldialog.classList.add('post_details_modal_low_width')
    })

  }

  likeAndUnlikePost(post_id: number, flag: number): void{

    this.requestService.postLikeAndUnlike(post_id, flag).subscribe(
        data=>{
          this.post.liked_by_user = flag ? 0 : 1;
          this.post.liked_by_user ? this.post.likes_count++ : this.post.likes_count--
        },
        error => {this.error = error; console.log(error);}
    )
  }



  fileDropped(event: any): void {

    this.mediaToAppServer = this.fileService.toNowFileInfo(event.srcElement.files[0]);

    if (this.mediaToAppServer.typeForApp === 'image' || this.mediaToAppServer.typeForApp === 'audio'){

      this.inProcess = true;
      this.requestService.getLinkForFileUpload(this.mediaToAppServer).subscribe(
          data=>{
            this.mediaToAppServer.link = data.urls[0];
            this.putFileToServer(this.mediaToAppServer)
          },
          error => {this.error = error; console.log(error);}
      );
    }
  }

  putFileToServer(settings: any): void {

    this.requestService.fileUpload(settings).subscribe(
        data=>{
          this.inProcess = false;
          console.log(data)
        },
        error => {this.error = error; console.log(error);}
    );
  }

  createNewComment(commentForm: NgForm):void {

    if (commentForm.value.text || this.mediaToAppServer){
      this.dataToServer.post = this.post;
      this.dataToServer.text = commentForm.value.text;
      this.dataToServer.media = {
        type: this.mediaToAppServer['typeForApp'],
        multimedia: this.mediaToAppServer['multimedia']
      }
    }

    this.requestService.createNewComment(this.dataToServer).subscribe(
        data=>{
          console.log(data)
          this.postComments.unshift(data.comment)
        },
        error => {this.error = error; console.log(error);}
    );
  }

}
