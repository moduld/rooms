import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFansInProfileComponent } from './users-fans-in-profile.component';

describe('UsersFansInProfileComponent', () => {
  let component: UsersFansInProfileComponent;
  let fixture: ComponentFixture<UsersFansInProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersFansInProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFansInProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
