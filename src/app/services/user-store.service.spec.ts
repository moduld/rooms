import { TestBed, inject } from '@angular/core/testing';

import { TokenStoreService } from './token-store.service';

describe('TokenStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenStoreService]
    });
  });

  it('should ...', inject([TokenStoreService], (service: TokenStoreService) => {
    expect(service).toBeTruthy();
  }));
});
