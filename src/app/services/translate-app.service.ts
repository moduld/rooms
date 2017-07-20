import { Injectable } from '@angular/core';

import {UserStoreService} from './user-store.service';

import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class TranslateAppService {

  languages:any[] = [{lang: 'english', short: 'en', direction: 'ltr'}, {lang: 'русский', short: 'ru', direction: 'rtl'}];
  langsForTranslate: string[] = ["english", "русский"];

  constructor(private storeservice: UserStoreService, private translate: TranslateService) {


  }

  runTranslation() {

    this.translate.addLangs(this.langsForTranslate);

    let savedLang = this.storeservice.getLanguages();

    if (!savedLang){

      let browserLang = this.translate.getBrowserLang();
      if (browserLang){
        let found: any;

        for (let i = 0; i < this.languages.length; i++){
          if (this.languages[i]['short'] === browserLang){
            found = this.languages[i];
            break
          }
        }
        this.translate.setDefaultLang(found ? found.lang : 'english');
        this.translate.use(found ? found.lang : 'english');

        setBodyDirection(found)
      } else {
        this.translate.setDefaultLang('english');
        this.translate.use('english');
      }
    } else {

      this.translate.setDefaultLang(savedLang.lang);
      this.translate.use(savedLang.lang);
      setBodyDirection(savedLang)
    }



    this.translate.onLangChange.subscribe((event: any) => {

      let found: any;
      for (let i = 0; i < this.languages.length; i++){
        if( this.languages[i]['lang'] === event.lang){
          found = this.languages[i];
          break
        }
      }
      this.storeservice.setLanguage(found);
      setBodyDirection(found)

    });

    function setBodyDirection(found: any) {

      if (found.direction === 'rtl'){
        document.body.classList.contains('ltr') && document.body.classList.remove('ltr');
        !document.body.classList.contains('rtl') && document.body.classList.add('rtl')
      } else {
        document.body.classList.contains('rtl') && document.body.classList.remove('rtl');
        !document.body.classList.contains('ltr') && document.body.classList.add('ltr')
      }
    }
  }

}
