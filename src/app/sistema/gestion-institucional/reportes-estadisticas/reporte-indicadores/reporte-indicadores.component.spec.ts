import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIndicadoresComponent } from './reporte-indicadores.component';

describe('ReporteIndicadoresComponent', () => {
  let component: ReporteIndicadoresComponent;
  let fixture: ComponentFixture<ReporteIndicadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteIndicadoresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
