import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuestionarioEstudianteComponent } from './cuestionario-estudiante.component';

describe('CuestionarioEstudianteComponent', () => {
  let component: CuestionarioEstudianteComponent;
  let fixture: ComponentFixture<CuestionarioEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuestionarioEstudianteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CuestionarioEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
