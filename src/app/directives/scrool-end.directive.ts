import { Directive,  ElementRef, OnInit  } from '@angular/core';

@Directive({
  selector: '[appScroolEnd]'
})
export class ScroolEndDirective  implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {

    this.elementRef.nativeElement.addEventListener('scroll',  this.scroolEnd);
  }

  scroolEnd(event): void {

    // console.log(event)
  }
}
