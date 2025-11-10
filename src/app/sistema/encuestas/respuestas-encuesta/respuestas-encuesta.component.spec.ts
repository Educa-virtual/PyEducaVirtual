import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestasEncuestaComponent } from './respuestas-encuesta.component';

describe('RespuestasEncuestaComponent', () => {
  let component: RespuestasEncuestaComponent;
  let fixture: ComponentFixture<RespuestasEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RespuestasEncuestaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RespuestasEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
