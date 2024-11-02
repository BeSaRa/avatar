import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LocalPopupComponent } from './local-popup.component'

describe('LocalPopupComponent', () => {
  let component: LocalPopupComponent
  let fixture: ComponentFixture<LocalPopupComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalPopupComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(LocalPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
