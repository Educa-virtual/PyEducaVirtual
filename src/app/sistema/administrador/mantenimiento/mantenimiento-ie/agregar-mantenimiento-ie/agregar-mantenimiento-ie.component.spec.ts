import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarMantenimientoIeComponent } from './agregar-mantenimiento-ie.component';

describe('AgregarMantenimientoIeComponent', () => {
  let component: AgregarMantenimientoIeComponent;
  let fixture: ComponentFixture<AgregarMantenimientoIeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarMantenimientoIeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarMantenimientoIeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
