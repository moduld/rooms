import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutRoomModalComponent } from './about-room-modal.component';

describe('AboutRoomModalComponent', () => {
  let component: AboutRoomModalComponent;
  let fixture: ComponentFixture<AboutRoomModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutRoomModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
