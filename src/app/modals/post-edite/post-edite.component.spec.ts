import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditeComponent } from './post-edite.component';

describe('PostEditeComponent', () => {
  let component: PostEditeComponent;
  let fixture: ComponentFixture<PostEditeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostEditeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEditeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
