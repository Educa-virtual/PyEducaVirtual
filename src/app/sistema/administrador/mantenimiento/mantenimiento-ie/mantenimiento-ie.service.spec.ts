import { TestBed } from '@angular/core/testing';

import { MantenimientoIeService } from './mantenimiento-ie.service';

describe('MantenimientoIeService', () => {
  let service: MantenimientoIeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MantenimientoIeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
