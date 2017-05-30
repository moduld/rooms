import { Directive,  ElementRef, OnInit, Output, EventEmitter  } from '@angular/core';

@Directive({
  selector: '[appScroolEnd]'
})
export class ScroolEndDirective  implements OnInit {

  @Output() scrollRichTheEnd = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {

    this.elementRef.nativeElement.addEventListener('scroll',  (event)=>{

      if (event.srcElement.scrollHeight <= event.srcElement.clientHeight + event.srcElement.scrollTop + 5){

        this.scrollRichTheEnd.emit(true);
      }
    });
  }

}
