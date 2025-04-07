import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AgentTaskStatusPopupComponent } from './agent-task-status-popup.component'

describe('AgentTaskStatusPopupComponent', () => {
  let component: AgentTaskStatusPopupComponent
  let fixture: ComponentFixture<AgentTaskStatusPopupComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentTaskStatusPopupComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AgentTaskStatusPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
