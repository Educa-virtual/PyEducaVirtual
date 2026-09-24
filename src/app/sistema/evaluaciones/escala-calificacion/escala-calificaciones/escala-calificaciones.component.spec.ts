import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalaCalificacionComponent } from './escala-calificacion.component';

describe('EscalaCalificacionComponent', () => {
  let component: EscalaCalificacionComponent;
  let fixture: ComponentFixture<EscalaCalificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscalaCalificacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EscalaCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
