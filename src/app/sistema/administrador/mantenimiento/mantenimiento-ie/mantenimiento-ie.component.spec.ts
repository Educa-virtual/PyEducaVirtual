import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoIeComponent } from './mantenimiento-ie.component';

describe('MantenimientoIeComponent', () => {
  let component: MantenimientoIeComponent;
  let fixture: ComponentFixture<MantenimientoIeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoIeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientoIeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
