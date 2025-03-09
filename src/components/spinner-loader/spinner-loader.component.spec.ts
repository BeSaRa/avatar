import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SpinnerLoaderComponent } from './spinner-loader.component'

describe('SpinnerLoaderComponent', () => {
  let component: SpinnerLoaderComponent
  let fixture: ComponentFixture<SpinnerLoaderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerLoaderComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SpinnerLoaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
