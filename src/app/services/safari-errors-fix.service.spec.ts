import { TestBed, inject } from '@angular/core/testing';

import { SafariErrorsFixService } from './safari-errors-fix.service';

describe('SafariErrorsFixService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafariErrorsFixService]
    });
  });

  it('should ...', inject([SafariErrorsFixService], (service: SafariErrorsFixService) => {
    expect(service).toBeTruthy();
  }));
});
