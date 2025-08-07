import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAcademicoComponent } from './reporte-academico.component';

describe('ReporteAcademicoComponent', () => {
  let component: ReporteAcademicoComponent;
  let fixture: ComponentFixture<ReporteAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteAcademicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
