import { TestBed, inject } from '@angular/core/testing';

import { AddRequiredInfoService } from './add-required-info.service';

describe('AddRequiredInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddRequiredInfoService]
    });
  });

  it('should ...', inject([AddRequiredInfoService], (service: AddRequiredInfoService) => {
    expect(service).toBeTruthy();
  }));
});
