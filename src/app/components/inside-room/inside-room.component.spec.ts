import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideRoomComponent } from './inside-room.component';

describe('InsideRoomComponent', () => {
  let component: InsideRoomComponent;
  let fixture: ComponentFixture<InsideRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsideRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsideRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
