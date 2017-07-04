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

    if (value){
      value =  value.replace(/\*([^*]*)\*/g, cutString);


    } else {
      args ? value = args : ''
    }


    return value
  }

}
