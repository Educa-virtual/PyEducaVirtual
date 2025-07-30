import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaCerradaComponent } from './pregunta-cerrada.component';

describe('PreguntaCerradaComponent', () => {
  let component: PreguntaCerradaComponent;
  let fixture: ComponentFixture<PreguntaCerradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaCerradaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreguntaCerradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
