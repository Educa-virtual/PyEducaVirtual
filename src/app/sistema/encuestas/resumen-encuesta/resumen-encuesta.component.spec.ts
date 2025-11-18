import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenEncuestaComponent } from './resumen-encuesta.component';

describe('ResumenEncuestaComponent', () => {
  let component: ResumenEncuestaComponent;
  let fixture: ComponentFixture<ResumenEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenEncuestaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
