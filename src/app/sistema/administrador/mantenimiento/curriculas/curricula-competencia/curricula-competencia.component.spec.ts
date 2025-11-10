import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculaCompetenciaComponent } from './curricula-competencia.component';

describe('CurriculaCompetenciaComponent', () => {
  let component: CurriculaCompetenciaComponent;
  let fixture: ComponentFixture<CurriculaCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculaCompetenciaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurriculaCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
