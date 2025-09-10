import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarLogroAlcanzadoComponent } from './registrar-logro-alcanzado.component';

describe('RegistrarLogroAlcanzadoComponent', () => {
  let component: RegistrarLogroAlcanzadoComponent;
  let fixture: ComponentFixture<RegistrarLogroAlcanzadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarLogroAlcanzadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarLogroAlcanzadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
