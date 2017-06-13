import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVisualMessagesComponent } from './show-visual-messages.component';

describe('ShowVisualMessagesComponent', () => {
  let component: ShowVisualMessagesComponent;
  let fixture: ComponentFixture<ShowVisualMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowVisualMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowVisualMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
