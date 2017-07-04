import { Component, OnInit, Input, Output } from '@angular/core';

import { NgForm} from '@angular/forms';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { FileInfoService } from '../../services/file-info.service';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

@Component({
  selector: 'app-post-edite',
  templateUrl: 'post-edite.component.html',
  styleUrls: ['post-edite.component.scss']
})
export class PostEditeComponent implements OnInit{

  error: any;
  mediaToAppServer: any[] = [];
  dataToServer: any = {};
  textField: string;
  disable_while_upload: boolean;
  private file: File;

  @Input() post;

  constructor(public activeModal: NgbActiveModal,
              private fileService: FileInfoService,
              private requestService: RequestService,
              private exchangeService: EventsExchangeService) {

    exchangeService.urlChangedEvent.subscribe(
        () => {
          this.activeModal.dismiss()
        });
  }

  @Output() public options = {
    readAs: 'ArrayBuffer'
  };

  public onFileDrop(file: File): void {
    this.mediaToAppServer.length < 4 && this.makeRequestSettings(file)
  }

  ngOnInit() {
    this.textField = this.post.text;
    this.mediaToAppServer = this.post.media;
    this.addPostPropertyes()
  }

  addPostPropertyes(): void {
    for (let i = 0; i < this.post.media.length; i++){
      this.post.media[i]['img_src'] = this.post.media[i].thumbnail;
      this.post.media[i]['uploaded'] = true;
      this.post.media[i]['typeForApp'] = this.post.media[i]['type'];
    }
  }

  fileDropped (event: any): void {
    this.makeRequestSettings(event.srcElement.files[0])
  }

  makeRequestSettings(data: any): void {

    let settings = this.fileService.toNowFileInfo(data);

    !settings && this.exchangeService.doShowVisualMessageForUser({success:false, message: 'File format is not allowed'});

    settings && this.mediaToAppServer.push(settings);

    settings ? this.disable_while_upload = true : '';

    settings && this.requestService.getLinkForFileUpload(settings).subscribe(
        data=>{
          settings.link = data.urls[0];
          this.putFileToServer(settings)
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t get link for the file'})}
    );

  }

  putFileToServer(settings: any): void {

    this.requestService.fileUpload(settings).subscribe(
        data=>{
          settings.uploaded = true;
          data.typeForApp === 'image' ? settings.img_src = settings.multimedia : '';
          this.disable_while_upload = false
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t send the file'})}
    );
  }

  editThisPost(postForm: NgForm, event:Event):void {

    event.preventDefault();

    this.dataToServer.text = postForm.value.text.trim();

    if (this.dataToServer.text || this.mediaToAppServer.length){
      this.dataToServer.media = [];
      for (let i = 0; i < this.mediaToAppServer.length; i++){
        this.dataToServer.media.push({type: this.mediaToAppServer[i]['typeForApp'], multimedia: this.mediaToAppServer[i]['multimedia']})
      }
    } else {
      return
    }

    this.dataToServer.post_id = this.post.post_id;

    this.requestService.editePost(this.dataToServer).subscribe(
        data=>{
          this.activeModal.close(data);
          this.exchangeService.doShowVisualMessageForUser({success:true, message: 'Post information changed successful'})
        },
        error => {
          this.error = error;
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: error.message || 'Something wrong, can\'t save changes'})}
    );
  }

  deletePreviewedImg(index: number): void {
    this.mediaToAppServer.splice(index, 1)
  }

}

