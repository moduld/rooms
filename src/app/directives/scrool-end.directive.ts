import { Directive,  ElementRef, OnInit, Input, Output, EventEmitter, ViewChild  } from '@angular/core';

@Directive({
  selector: '[appScroolEnd]'
})
export class ScroolEndDirective  implements OnInit {

  @Output() scrollRichTheEnd = new EventEmitter<boolean>();
  @Output() scrollRichTheTop = new EventEmitter<boolean>();
  @Output() scrollAction = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {



    this.elementRef.nativeElement.addEventListener('scroll',  (event)=>{

      if ( event.target.scrollTop > 0){
        this.scrollAction.emit(true);
      } else {
        this.scrollAction.emit(false);
      }

      if (event.target.scrollHeight <= event.target.clientHeight + event.target.scrollTop + 5){

        this.scrollRichTheEnd.emit(true);
      }


      if (event.target.scrollTop === 0){

        this.scrollRichTheTop.emit(true);
      }

    });
  }

}
