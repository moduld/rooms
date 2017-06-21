import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Input() contentArray: any;
  zoom_value:number;

  constructor( private config: NgbCarouselConfig) {
    config.interval = -1;
    config.wrap = true;
    config.keyboard = false;
  }

  ngOnInit() {
    this.zoom_value = 1;
  }

  changeZoom(flag:boolean):void {

    if (flag && this.zoom_value < 2){
      this.zoom_value = Number((this.zoom_value + 0.1).toFixed(1))
    }

    if(!flag && this.zoom_value > 0.1){
      this.zoom_value = Number((this.zoom_value - 0.1).toFixed(1))
    }
  }

}
