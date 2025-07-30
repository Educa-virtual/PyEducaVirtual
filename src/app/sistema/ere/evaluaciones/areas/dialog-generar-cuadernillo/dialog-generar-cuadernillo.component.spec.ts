import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGenerarCuadernilloComponent } from './dialog-generar-cuadernillo.component';

describe('DialogGenerarCuadernilloComponent', () => {
  let component: DialogGenerarCuadernilloComponent;
  let fixture: ComponentFixture<DialogGenerarCuadernilloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogGenerarCuadernilloComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogGenerarCuadernilloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
