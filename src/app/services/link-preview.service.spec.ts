import { TestBed, inject } from '@angular/core/testing';

import { LinkPreviewService } from './link-preview.service';

describe('LinkPreviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinkPreviewService]
    });
  });

  it('should ...', inject([LinkPreviewService], (service: LinkPreviewService) => {
    expect(service).toBeTruthy();
  }));
});
