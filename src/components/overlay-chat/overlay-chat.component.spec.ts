import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OverlayChatComponent } from './overlay-chat.component'

describe('OverlayChatComponent', () => {
  let component: OverlayChatComponent
  let fixture: ComponentFixture<OverlayChatComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayChatComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(OverlayChatComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
