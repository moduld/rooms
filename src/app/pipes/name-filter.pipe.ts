import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameFilter'
})
export class NameFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (!args){
      return value
    } else {
      let returns = value.filter( (item) => {
        return item.user.user_name.indexOf(args.trim()) >= 0
      });

      return returns;
    }
  }
}
