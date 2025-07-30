import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaPreguntasComponent } from './encuesta-preguntas.component';

describe('EncuestaPreguntasComponent', () => {
  let component: EncuestaPreguntasComponent;
  let fixture: ComponentFixture<EncuestaPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncuestaPreguntasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EncuestaPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
