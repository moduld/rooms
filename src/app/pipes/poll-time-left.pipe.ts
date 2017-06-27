import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pollTimeLeft'
})
export class PollTimeLeftPipe implements PipeTransform {

  transform(post: any, args?: any): any {


    let output;

    if (post.poll.time_left){

      let minutes = Math.floor((post.poll.time_left / 60) % 60);
      let minuteWord = minutes == 1 ? 'minute' : 'minutes';
      let hours = Math.floor((post.poll.time_left / ( 60 * 60)) % 24);
      let hourWord = hours === 1 ? 'hour' : 'hours';
      let days = Math.floor(post.poll.time_left / (60 * 60 * 24));
      let daysWord = days === 1 ? 'day' : 'days';

      output = `${days} ${daysWord} ${hours} ${hourWord} ${minutes} ${minuteWord}`
    } else {
      output = 'Voting closed'
    }

    return output
  }

}
