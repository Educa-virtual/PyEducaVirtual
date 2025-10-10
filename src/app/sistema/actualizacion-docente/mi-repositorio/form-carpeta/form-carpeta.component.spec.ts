import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCarpetaComponent } from './form-carpeta.component';

describe('FormCarpetaComponent', () => {
  let component: FormCarpetaComponent;
  let fixture: ComponentFixture<FormCarpetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCarpetaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCarpetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
