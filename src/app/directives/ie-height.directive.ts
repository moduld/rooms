import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appIeHeight]'
})
export class IeHeightDirective implements OnInit{

  constructor(private elementRef: ElementRef) {
  }

ngOnInit() {
    this.changeHeight();
    window.addEventListener('resize',  this.changeHeight);
}
  changeHeight():void {

    if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)){
    if(this.elementRef.nativeElement.offsetHeight > document.body.offsetHeight){
      document.body.style.height = 'auto';
    } else {
      document.body.style.height = '100%';
    }
    if (this.elementRef.nativeElement.offsetHeight > this.elementRef.nativeElement.parentNode.offsetHeight){
      document.body.style.height = 'auto';
    }
  }
}

}
