import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPostsInProfileComponent } from './users-posts-in-profile.component';

describe('UsersPostsInProfileComponent', () => {
  let component: UsersPostsInProfileComponent;
  let fixture: ComponentFixture<UsersPostsInProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersPostsInProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPostsInProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
