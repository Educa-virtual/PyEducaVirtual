import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaEscalaComponent } from './pregunta-escala.component';

describe('PreguntaEscalaComponent', () => {
  let component: PreguntaEscalaComponent;
  let fixture: ComponentFixture<PreguntaEscalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaEscalaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreguntaEscalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
