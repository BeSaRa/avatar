import { TestBed } from '@angular/core/testing';

import { BreadcumbService } from './breadcumb.service';

describe('BreadcumbService', () => {
  let service: BreadcumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreadcumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
