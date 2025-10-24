import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialDesercionComponent } from './historial-desercion.component';

describe('HistorialDesercionComponent', () => {
  let component: HistorialDesercionComponent;
  let fixture: ComponentFixture<HistorialDesercionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialDesercionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialDesercionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
