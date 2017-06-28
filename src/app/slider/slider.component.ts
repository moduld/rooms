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
    //hack to hide slider arrows when only one media. Plugin don't have native settings to hide it.
    if (this.contentArray.length < 2){
      let leftArr = document.getElementsByClassName('carousel-control-prev');
      leftArr && leftArr[0].setAttribute('hidden', 'hidden');
      let rightArr = document.getElementsByClassName('carousel-control-next');
      rightArr && rightArr[0].setAttribute('hidden', 'hidden')
    }
  }

  changeZoom(flag:boolean):void {

    if (flag && this.zoom_value < 2){
      this.zoom_value = Number((this.zoom_value + 0.1).toFixed(1))
    }

    if(!flag && this.zoom_value > 0.1){
      this.zoom_value = Number((this.zoom_value - 0.1).toFixed(1))
    }
  }

  openImageLink(content: any):void {

    let newWidth = Math.round(window.innerWidth * 0.75);
    let newHeight = Math.round(window.innerHeight * 0.75);
    let leftPosition = Math.round(window.innerHeight * 0.125);
    let topPosition = Math.round(window.innerHeight * 0.125);
    let concat = 'width=' + newWidth + ',' + 'height=' + newHeight + ',' + 'left=' + leftPosition + ',' + 'top=' + topPosition;
    window.open(content.multimedia, "fullscreen=no",  concat)
  }

}
