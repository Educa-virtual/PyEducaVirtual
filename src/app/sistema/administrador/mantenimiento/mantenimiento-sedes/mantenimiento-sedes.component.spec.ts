import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoSedesComponent } from './mantenimiento-sedes.component';

describe('MantenimientoSedesComponent', () => {
  let component: MantenimientoSedesComponent;
  let fixture: ComponentFixture<MantenimientoSedesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoSedesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientoSedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
