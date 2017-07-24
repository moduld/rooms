import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {OpenNewWindowService} from '../../services/index';
import { Lightbox } from 'angular2-lightbox';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-slider',
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Input() contentArray: any;
  zoom_value:number;

  constructor( private config: NgbCarouselConfig,
               private openNewWindow: OpenNewWindowService,
               private _lightbox: Lightbox) {

    config.interval = -1;
    config.wrap = true;
    config.keyboard = false;
  }

  ngOnInit() {
    this.zoom_value = 1;
    //hack to hide slider arrows when only one media. Plugin don't have native settings to hide it.
      let leftArr = document.getElementsByClassName('carousel-control-prev');
      leftArr && leftArr[0].setAttribute('hidden', 'hidden');
      let rightArr = document.getElementsByClassName('carousel-control-next');
      rightArr && rightArr[0].setAttribute('hidden', 'hidden');
      let pagination = document.getElementsByClassName('carousel-indicators');
      pagination && this.contentArray && this.contentArray.length < 2 && pagination[0].setAttribute('hidden', 'hidden')
  }


  openImageLink(content: any):void {

    this.openNewWindow.openImageLink(content)

  }

  openLightBox(content):void {

    let album = [{
      src: content.multimedia,
      caption: '',
      thumb: content.thumbnail
    }];

    this._lightbox.open(album);
  }



}
