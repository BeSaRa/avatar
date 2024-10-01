import { BaseCrudModel } from './base-crud-model'

describe('BaseModel', () => {
  it('should create an instance', () => {
    // @ts-expect-error just to ignore the error
    expect(new BaseCrudModel()).toBeTruthy()
  })
})
