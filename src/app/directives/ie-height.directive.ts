import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appIeHeight]'
})
export class IeHeightDirective implements OnInit{


  element: any = this.elementRef;
  elementHeight: number;

  constructor(private elementRef: ElementRef) {}



ngOnInit() {

  if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)){

    this.setIEHeight();

    setInterval(()=>{

      this.element.nativeElement.offsetHeight !== this.elementHeight &&  this.setIEHeight();

    }, 1000);
  }

}

  setIEHeight():void {

      if(this.element.nativeElement.offsetHeight > document.body.offsetHeight){
        document.body.style.height = 'auto';
      } else {
        document.body.style.height = '100%';
      }
      if (this.element.nativeElement.offsetHeight > this.element.nativeElement.parentNode.offsetHeight){
        document.body.style.height = 'auto';
      }

      this.elementHeight = this.element.nativeElement.offsetHeight

  }
}
