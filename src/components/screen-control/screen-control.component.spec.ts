import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ScreenControlComponent } from './screen-control.component'

describe('ScreenControlComponent', () => {
  let component: ScreenControlComponent
  let fixture: ComponentFixture<ScreenControlComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenControlComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ScreenControlComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
