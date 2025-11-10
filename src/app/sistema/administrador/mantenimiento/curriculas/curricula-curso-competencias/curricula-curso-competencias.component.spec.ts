import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculaCursoCompetenciasComponent } from './curricula-curso-competencias.component';

describe('CurriculaCursoCompetenciasComponent', () => {
  let component: CurriculaCursoCompetenciasComponent;
  let fixture: ComponentFixture<CurriculaCursoCompetenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculaCursoCompetenciasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurriculaCursoCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
