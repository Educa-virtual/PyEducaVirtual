import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarDesercionesComponent } from './gestionar-deserciones.component';

describe('GestionarDesercionesComponent', () => {
  let component: GestionarDesercionesComponent;
  let fixture: ComponentFixture<GestionarDesercionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarDesercionesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarDesercionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
