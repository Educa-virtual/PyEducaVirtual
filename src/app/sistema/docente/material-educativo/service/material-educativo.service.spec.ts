import { TestBed } from '@angular/core/testing';

import { MaterialEducativoService } from './material-educativo.service';

describe('MaterialEducativoService', () => {
  let service: MaterialEducativoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialEducativoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
