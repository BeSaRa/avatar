import { TestBed } from '@angular/core/testing'

import { AgentChatService } from './agent-chat.service'

describe('AgentChatService', () => {
  let service: AgentChatService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AgentChatService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
