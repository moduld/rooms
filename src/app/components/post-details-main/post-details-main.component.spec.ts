import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailsMainComponent } from './post-details-main.component';

describe('PostDetailsMainComponent', () => {
  let component: PostDetailsMainComponent;
  let fixture: ComponentFixture<PostDetailsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostDetailsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDetailsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
