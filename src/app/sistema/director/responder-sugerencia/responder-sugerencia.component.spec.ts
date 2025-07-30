import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderSugerenciaComponent } from './responder-sugerencia.component';

describe('ResponderSugerenciaComponent', () => {
  let component: ResponderSugerenciaComponent;
  let fixture: ComponentFixture<ResponderSugerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponderSugerenciaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponderSugerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
