import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateRoomComponent } from './private-room.component';

describe('PrivateRoomComponent', () => {
  let component: PrivateRoomComponent;
  let fixture: ComponentFixture<PrivateRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
