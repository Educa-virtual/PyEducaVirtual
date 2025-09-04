import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaTextoComponent } from './pregunta-texto.component';

describe('PreguntaTextoComponent', () => {
  let component: PreguntaTextoComponent;
  let fixture: ComponentFixture<PreguntaTextoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaTextoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreguntaTextoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
