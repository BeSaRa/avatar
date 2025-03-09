import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TextAvatarComponent } from './video-generator.component'

describe('TextAvatarComponent', () => {
  let component: TextAvatarComponent
  let fixture: ComponentFixture<TextAvatarComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAvatarComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TextAvatarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
