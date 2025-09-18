import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaDiscapacidadRegistroComponent } from './ficha-discapacidad-registro.component';

describe('FichaDiscapacidadRegistroComponent', () => {
  let component: FichaDiscapacidadRegistroComponent;
  let fixture: ComponentFixture<FichaDiscapacidadRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaDiscapacidadRegistroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaDiscapacidadRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
