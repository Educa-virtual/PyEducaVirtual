import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionAprendizajeFormComponent } from './sesion-aprendizaje-form.component';

describe('SesionAprendizajeFormComponent', () => {
  let component: SesionAprendizajeFormComponent;
  let fixture: ComponentFixture<SesionAprendizajeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionAprendizajeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SesionAprendizajeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
