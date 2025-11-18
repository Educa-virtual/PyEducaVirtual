import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculaCompetenciaCapacidadesComponent } from './curricula-competencia-capacidades.component';

describe('CurriculaCompetenciaCapacidadesComponent', () => {
  let component: CurriculaCompetenciaCapacidadesComponent;
  let fixture: ComponentFixture<CurriculaCompetenciaCapacidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculaCompetenciaCapacidadesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurriculaCompetenciaCapacidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
