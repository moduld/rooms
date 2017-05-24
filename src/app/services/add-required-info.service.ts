import { Injectable } from '@angular/core';

@Injectable()
export class AddRequiredInfoService {

  constructor() { }

  addInfo(data): any {

    if (Array.isArray(data)){
      let output = [];

      for (let i = 0; i < data.length; i++){
        let currentItem = {};
        currentItem['created_at'] = data[i]['created_at'];
        currentItem['room'] = data[i];
        output.push(currentItem)
      }

      return output
    } else {
      return []
    }
  }

}
