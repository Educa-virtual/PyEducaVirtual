import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaOpcionSimpleComponent } from './pregunta-opcion-simple.component';

describe('PreguntaOpcionSimpleComponent', () => {
  let component: PreguntaOpcionSimpleComponent;
  let fixture: ComponentFixture<PreguntaOpcionSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaOpcionSimpleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreguntaOpcionSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
