import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempAvatarComponent } from './temp-avatar.component';

describe('TempAvatarComponent', () => {
  let component: TempAvatarComponent;
  let fixture: ComponentFixture<TempAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
