import { TestBed, inject } from '@angular/core/testing';

import { TranslateAppService } from './translate-app.service';

describe('TranslateAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslateAppService]
    });
  });

  it('should be created', inject([TranslateAppService], (service: TranslateAppService) => {
    expect(service).toBeTruthy();
  }));
});
