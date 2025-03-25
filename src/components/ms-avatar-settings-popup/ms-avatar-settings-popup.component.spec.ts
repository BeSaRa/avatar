import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MsAvatarSettingsPopupComponent } from './ms-avatar-settings-popup.component'

describe('MsAvatarSettingsPopupComponent', () => {
  let component: MsAvatarSettingsPopupComponent
  let fixture: ComponentFixture<MsAvatarSettingsPopupComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsAvatarSettingsPopupComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(MsAvatarSettingsPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
