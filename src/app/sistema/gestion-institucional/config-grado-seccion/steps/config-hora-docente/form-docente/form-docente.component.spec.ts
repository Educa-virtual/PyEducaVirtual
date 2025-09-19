import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDocenteComponent } from './form-docente.component';

describe('FormDocenteComponent', () => {
  let component: FormDocenteComponent;
  let fixture: ComponentFixture<FormDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDocenteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
