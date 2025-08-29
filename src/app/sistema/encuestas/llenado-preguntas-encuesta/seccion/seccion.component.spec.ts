import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSeccionEncuestaComponent } from './seccion.component';

describe('AgregarSeccionEncuestaComponent', () => {
  let component: AgregarSeccionEncuestaComponent;
  let fixture: ComponentFixture<AgregarSeccionEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarSeccionEncuestaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarSeccionEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
