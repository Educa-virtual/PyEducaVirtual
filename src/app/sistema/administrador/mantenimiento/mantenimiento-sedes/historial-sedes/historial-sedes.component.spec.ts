import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialSedesComponent } from './historial-sedes.component';

describe('HistorialSedesComponent', () => {
  let component: HistorialSedesComponent;
  let fixture: ComponentFixture<HistorialSedesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialSedesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialSedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
