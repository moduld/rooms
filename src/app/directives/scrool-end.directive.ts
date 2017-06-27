import { Directive,  ElementRef, OnInit, Input, Output, EventEmitter  } from '@angular/core';

@Directive({
  selector: '[appScroolEnd]'
})
export class ScroolEndDirective  implements OnInit {

  @Output() scrollRichTheEnd = new EventEmitter<boolean>();
  @Output() scrollRichTheTop = new EventEmitter<boolean>();
  @Output() scrollAction = new EventEmitter<boolean>();
  @Input() appScroolEnd: boolean;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {

    this.elementRef.nativeElement.addEventListener('scroll',  (event)=>{

      if (event.srcElement.scrollTop > 0){
        this.scrollAction.emit(true);
      } else {
        this.scrollAction.emit(false);
      }


      if (event.srcElement.scrollHeight <= event.srcElement.clientHeight + event.srcElement.scrollTop + 5){

        this.scrollRichTheEnd.emit(true);
      }

      // if (event.srcElement.scrollTop < event.srcElement.clientHeight + 5){
      //
      //   this.scrollRichTheTop.emit(true);
      // }
      //
      // if(this.appScroolEnd){
      //   this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;
      // }
    });
  }

}
