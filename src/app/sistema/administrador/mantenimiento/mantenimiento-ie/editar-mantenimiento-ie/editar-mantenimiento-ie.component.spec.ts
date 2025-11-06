import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMantenimientoIeComponent } from './editar-mantenimiento-ie.component';

describe('EditarMantenimientoIeComponent', () => {
  let component: EditarMantenimientoIeComponent;
  let fixture: ComponentFixture<EditarMantenimientoIeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarMantenimientoIeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarMantenimientoIeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
