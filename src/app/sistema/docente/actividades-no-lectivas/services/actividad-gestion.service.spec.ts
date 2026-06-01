import { TestBed } from '@angular/core/testing';

import { ActividadGestionService } from './actividad-gestion.service';

describe('ActividadGestionService', () => {
  let service: ActividadGestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadGestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
