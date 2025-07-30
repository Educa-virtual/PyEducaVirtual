import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaResumenComponent } from './encuesta-resumen.component';

describe('EncuestaResumenComponent', () => {
  let component: EncuestaResumenComponent;
  let fixture: ComponentFixture<EncuestaResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncuestaResumenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EncuestaResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
