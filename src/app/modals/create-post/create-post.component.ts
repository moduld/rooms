import { Component, OnInit, Output, Input} from '@angular/core';
import { NgForm} from '@angular/forms';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { FileInfoService } from '../../services/file-info.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-create-post',
  templateUrl: 'create-post.component.html',
  styleUrls: ['create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  viewToggle: boolean;
  error: any;
  mediaToAppServer: any[] = [];
  dataToServer: any = {};
  textField: string;
  duration_model: number;
  private file: File;

  @Input() wall_id;
  @Input() room_id;

  constructor(public activeModal: NgbActiveModal, private fileService: FileInfoService, private requestService: RequestService,) { }

  @Output() public options = {
    readAs: 'ArrayBuffer'
  };
  public onFileDrop(file: File): void {
    this.makeRequestSettings(file)
  }

  ngOnInit() {
    this.viewToggle = true;
    this.textField = '';
    this.duration_model = 1;
  }

  fileDropped (event: any): void {
    this.makeRequestSettings(event.srcElement.files[0])
  }

  makeRequestSettings(data: any): void {
    let settings = this.fileService.toNowFileInfo(data);
    this.requestService.getLinkForFileUpload(settings).subscribe(
        data=>{
          settings.link = data.urls[0];
          this.putFileToServer(settings)
        },
        error => {this.error = error; console.log(error);}
    );

  }

  putFileToServer(settings: any): void {

    this.requestService.fileUpload(settings).subscribe(
        data=>{
          console.log(data)
          this.mediaToAppServer.push(data);
        },
        error => {this.error = error; console.log(error);}
    );
  }

  createNewPost(postForm: NgForm):void {

    this.dataToServer.text = postForm.value.text;
    if (postForm.value.mod_type){
      this.dataToServer.media = [];
      for (let i = 0; i < this.mediaToAppServer.length; i++){
        this.dataToServer.media.push({type: this.mediaToAppServer[i]['typeForApp'], multimedia: this.mediaToAppServer[i]['multimedia']})
      }
      this.requestService.createNewPost(this.wall_id, this.room_id, this.dataToServer).subscribe(
          data=>{
            console.log(data)
          },
          error => {this.error = error; console.log(error);}
      );
    } else {
      this.dataToServer.poll = {};
      this.dataToServer.poll['question'] = postForm.value.question;
      postForm.value.choice1 ? this.dataToServer.poll['choice1'] = postForm.value.choice1 : '';
      postForm.value.choice2 ? this.dataToServer.poll['choice2'] =  postForm.value.choice2 : '';
      postForm.value.choice3 ? this.dataToServer.poll['choice3'] =  postForm.value.choice3 : '';
      postForm.value.choice4 ? this.dataToServer.poll['choice4'] =  postForm.value.choice4 : '';
      this.dataToServer.poll['duration'] = postForm.value.duration;

      this.requestService.createNewPost(this.wall_id, this.room_id, this.dataToServer).subscribe(
          data=>{
            console.log(data)
          },
          error => {this.error = error; console.log(error);}
      );
    }
  }


}
