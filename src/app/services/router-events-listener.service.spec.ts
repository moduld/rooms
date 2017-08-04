import { TestBed, inject } from '@angular/core/testing';

import { RouterEventsListenerService } from './router-events-listener.service';

describe('RouterEventsListenerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouterEventsListenerService]
    });
  });

  it('should be created', inject([RouterEventsListenerService], (service: RouterEventsListenerService) => {
    expect(service).toBeTruthy();
  }));
});
