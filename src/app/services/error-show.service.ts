import { Injectable } from '@angular/core';

@Injectable()
export class ErrorShowService {

  constructor() { }

  //user in registration and log-in components
  errorShow (element: any){
    element.nativeElement.classList.remove("ng-valid");
    element.nativeElement.classList.add("ng-invalid");
  }

  errorHide (element: any){
    element.nativeElement.classList.remove("ng-invalid");
    element.nativeElement.classList.add("ng-valid");
  }

}
