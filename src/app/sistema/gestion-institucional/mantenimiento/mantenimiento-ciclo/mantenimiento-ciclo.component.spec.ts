import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoCicloComponent } from './mantenimiento-ciclo.component';

describe('MantenimientoCicloComponent', () => {
  let component: MantenimientoCicloComponent;
  let fixture: ComponentFixture<MantenimientoCicloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoCicloComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientoCicloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
