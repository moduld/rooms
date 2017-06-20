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
  constructor( private config: NgbCarouselConfig) {
    config.interval = -1;
    config.wrap = true;
    config.keyboard = false;
  }

  ngOnInit() {
  console.log(this.contentArray)
  }

}
