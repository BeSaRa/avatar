import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MsAvatarComponent } from './ms-avatar.component'

describe('MsAvatarComponent', () => {
  let component: MsAvatarComponent
  let fixture: ComponentFixture<MsAvatarComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsAvatarComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(MsAvatarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
