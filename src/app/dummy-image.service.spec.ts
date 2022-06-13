import { TestBed } from '@angular/core/testing';

import { DummyImageService } from './dummy-image.service';

describe('DummyImageService', () => {
  let service: DummyImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DummyImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
