import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asteriscReplace'
})
export class AsteriscReplacePipe implements PipeTransform {

  transform(value: any, args?: any): any {



    function cutString(val){
      let newVal = val.substring(1, val.length-1);

      return `<span class="bold_text">${newVal}</span>`
    }

    function linkReplace(val){

      return `<a href="${val}" class="prev_link" target="_blank">${val}</a>`
    }

    if (value){
      value =  value.replace(/\*([^*]*)\*/g, cutString);
      value = value.replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, linkReplace)

    } else {
      args ? value = args : ''
    }


    return value
  }

}
