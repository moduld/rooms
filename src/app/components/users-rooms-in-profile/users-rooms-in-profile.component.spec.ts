import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersRoomsInProfileComponent } from './users-rooms-in-profile.component';

describe('UsersRoomsInProfileComponent', () => {
  let component: UsersRoomsInProfileComponent;
  let fixture: ComponentFixture<UsersRoomsInProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersRoomsInProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersRoomsInProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
