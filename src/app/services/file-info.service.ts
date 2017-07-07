import { Injectable } from '@angular/core';

@Injectable()
export class FileInfoService {

  constructor() { }

  //used in components where need to attach some files to upload
  toNowFileInfo (file: any, place?:string): any {

    let resultObject = new Object;
    if (file.type){

      if (file.type === "application/pdf"){
        resultObject['folder'] = 'posts/pdfs/';
        resultObject['content_type'] = "application/pdf";
        resultObject['typeForApp'] = 'pdf';
        resultObject['ext'] = 'pdf';
        resultObject['img_src'] = 'assets/img/tifos_pdf_icon.png';
      }
      if (file.type === "image/png"){
        resultObject['folder'] = 'posts/images/';
        resultObject['content_type'] = "image/png";
        resultObject['typeForApp'] = 'image';
        resultObject['ext'] = 'png';
        resultObject['img_src'] = 'assets/img/img-default.png';

      }
      if (file.type === "image/gif"){
        resultObject['folder'] = 'posts/images/';
        resultObject['content_type'] = "image/gif";
        resultObject['typeForApp'] = 'image';
        resultObject['ext'] = 'gif';
        resultObject['img_src'] = 'assets/img/img-default.png';
      }
      if (file.type === "image/jpeg"){
        resultObject['folder'] = 'posts/images/';
        place === 'rooms' ? resultObject['folder'] = 'rooms/images/' : '';
        place === 'users' ? resultObject['folder'] = 'users/images/' : '';
        resultObject['content_type'] = "image/jpeg";
        resultObject['typeForApp'] = 'image';
        resultObject['ext'] = 'jpeg';
        resultObject['img_src'] = 'assets/img/img-default.png';
      }
      if (file.type === "video/mp4"){
        resultObject['folder'] = 'posts/videos/';
        resultObject['content_type'] = "video/mp4";
        resultObject['typeForApp'] = 'video';
        resultObject['ext'] = 'mp4';
        resultObject['img_src'] =  'assets/img/tifos_video_icon.png';
      }

      if (file.type === "audio/mp3"){
        resultObject['folder'] = 'posts/audios/';
        resultObject['content_type'] = "audio/mp3";
        resultObject['typeForApp'] = 'audio';
        resultObject['ext'] = 'mp3';
        resultObject['img_src'] =  'assets/img/tifos_audio_icon.png';
      }
      if (file.type === "audio/wav"){
        resultObject['folder'] = 'posts/audios/';
        resultObject['content_type'] = "audio/wav";
        resultObject['typeForApp'] = 'audio';
        resultObject['ext'] = 'wav';
        resultObject['img_src'] =  'assets/img/tifos_audio_icon.png';
      }

      resultObject['file'] = file;
      resultObject['uploaded'] = false;
      return resultObject
    } else {

      let extension = file.name.split('.').pop();

      if (extension === 'ppt' || extension === 'pptx'|| extension === 'xls' || extension === 'xlsx' || extension === 'doc' || extension === 'docx'){

        resultObject['folder'] = 'posts/docs/';
        extension === 'ppt' ?  resultObject['content_type'] = "application/vnd.ms-powerpoint" : '';
        extension === 'pptx' ?  resultObject['content_type'] = "application/vnd.openxmlformats-officedocument.presentationml.presentation" : '';
        extension === 'xls' ?  resultObject['content_type'] = "application/vnd.ms-excel" : '';
        extension === 'xlsx' ?  resultObject['content_type'] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : '';
        extension === 'doc' ?  resultObject['content_type'] = "application/msword" : '';
        extension === 'docx' ?  resultObject['content_type'] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : '';

        resultObject['typeForApp'] = extension;
        resultObject['ext'] = extension;
        resultObject['img_src'] =  'assets/img/tifos_audio_icon.png';

        resultObject['file'] = file;
        resultObject['uploaded'] = false;
        return resultObject
      }

      return false
    }
  }

}
