import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionPreguntasComponent } from './evaluacion-preguntas.component';

describe('EvaluacionPreguntasComponent', () => {
  let component: EvaluacionPreguntasComponent;
  let fixture: ComponentFixture<EvaluacionPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionPreguntasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluacionPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
