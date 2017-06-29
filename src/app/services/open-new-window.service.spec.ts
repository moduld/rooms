import { TestBed, inject } from '@angular/core/testing';

import { OpenNewWindowService } from './open-new-window.service';

describe('OpenNewWindowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenNewWindowService]
    });
  });

  it('should ...', inject([OpenNewWindowService], (service: OpenNewWindowService) => {
    expect(service).toBeTruthy();
  }));
});
