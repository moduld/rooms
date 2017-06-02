import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutedBlockedComponent } from './muted-blocked.component';

describe('MutedBlockedComponent', () => {
  let component: MutedBlockedComponent;
  let fixture: ComponentFixture<MutedBlockedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutedBlockedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutedBlockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
