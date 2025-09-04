import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaOpcionMultipleComponent } from './pregunta-opcion-multiple.component';

describe('PreguntaOpcionMultipleComponent', () => {
  let component: PreguntaOpcionMultipleComponent;
  let fixture: ComponentFixture<PreguntaOpcionMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaOpcionMultipleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreguntaOpcionMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
