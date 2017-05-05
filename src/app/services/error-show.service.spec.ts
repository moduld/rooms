import { TestBed, inject } from '@angular/core/testing';

import { ErrorShowService } from './error-show.service';

describe('ErrorShowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorShowService]
    });
  });

  it('should ...', inject([ErrorShowService], (service: ErrorShowService) => {
    expect(service).toBeTruthy();
  }));
});
