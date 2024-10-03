import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AvatarVideoComponent } from './avatar-video.component'

describe('AvatarVideoComponent', () => {
  let component: AvatarVideoComponent
  let fixture: ComponentFixture<AvatarVideoComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarVideoComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AvatarVideoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
