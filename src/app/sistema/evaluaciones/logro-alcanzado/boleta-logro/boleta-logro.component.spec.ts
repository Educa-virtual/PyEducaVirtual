import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletaLogroComponent } from './boleta-logro.component';

describe('BoletaLogroComponent', () => {
  let component: BoletaLogroComponent;
  let fixture: ComponentFixture<BoletaLogroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletaLogroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoletaLogroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
