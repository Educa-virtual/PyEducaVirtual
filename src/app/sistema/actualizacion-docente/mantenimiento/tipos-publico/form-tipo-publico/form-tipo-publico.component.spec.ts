import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTipoPublicoComponent } from './form-tipo-publico.component';

describe('FormTipoPublicoComponent', () => {
  let component: FormTipoPublicoComponent;
  let fixture: ComponentFixture<FormTipoPublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTipoPublicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTipoPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
