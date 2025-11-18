import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSedesComponent } from './formulario-sedes.component';

describe('FormularioSedesComponent', () => {
  let component: FormularioSedesComponent;
  let fixture: ComponentFixture<FormularioSedesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioSedesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioSedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
