import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutRoomComponent } from './about-room.component';

describe('AboutRoomComponent', () => {
  let component: AboutRoomComponent;
  let fixture: ComponentFixture<AboutRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
