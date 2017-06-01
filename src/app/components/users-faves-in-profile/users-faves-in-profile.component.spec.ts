import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFavesInProfileComponent } from './users-faves-in-profile.component';

describe('UsersFavesInProfileComponent', () => {
  let component: UsersFavesInProfileComponent;
  let fixture: ComponentFixture<UsersFavesInProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersFavesInProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFavesInProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
