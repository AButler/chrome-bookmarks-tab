import { TestBed } from '@angular/core/testing';

import { SimpleflakeService } from './simpleflake.service';

describe('SimpleflakeService', () => {
  let service: SimpleflakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleflakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
