import { Injectable } from '@angular/core';

@Injectable()
export class FileInfoService {

  constructor() { }

  toNowFileInfo (file: any): any {

    if (file.type){
      let resultObject = new Object;
      if (file.type === "application/pdf"){
        resultObject['folder'] = 'posts/pdfs/';
        resultObject['content_type'] = "application/pdf";
        resultObject['typeForApp'] = 'pdf';
        resultObject['ext'] = 'pdf';
        resultObject['img_src'] = 'assets/img/pdf-default.png';
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
        resultObject['content_type'] = "image/jpeg";
        resultObject['typeForApp'] = 'image';
        resultObject['ext'] = 'jpg';
        resultObject['img_src'] = 'assets/img/img-default.png';
      }
      if (file.type === "video/mp4"){
        resultObject['folder'] = 'posts/videos/';
        resultObject['content_type'] = "video/mp4";
        resultObject['typeForApp'] = 'video';
        resultObject['ext'] = 'mp4';
        resultObject['img_src'] =  'assets/img/video-default.png';
      }

      if (file.type === "audio/mp3"){
        resultObject['folder'] = 'posts/audios/';
        resultObject['content_type'] = "audio/mp3";
        resultObject['typeForApp'] = 'audio';
        resultObject['ext'] = 'mp3';
        resultObject['img_src'] =  'assets/img/sound-default.png';
      }
      if (file.type === "audio/wav"){
        resultObject['folder'] = 'posts/audios/';
        resultObject['content_type'] = "audio/wav";
        resultObject['typeForApp'] = 'audio';
        resultObject['ext'] = 'wav';
        resultObject['img_src'] =  'assets/img/sound-default.png';
      }

      resultObject['file'] = file;
      resultObject['uploaded'] = false;
      return resultObject
    } else {
      return false
    }
  }

}
