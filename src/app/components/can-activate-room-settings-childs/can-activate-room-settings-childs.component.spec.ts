import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanActivateRoomSettingsChildsComponent } from './can-activate-room-settings-childs.component';

describe('CanActivateRoomSettingsChildsComponent', () => {
  let component: CanActivateRoomSettingsChildsComponent;
  let fixture: ComponentFixture<CanActivateRoomSettingsChildsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanActivateRoomSettingsChildsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanActivateRoomSettingsChildsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
