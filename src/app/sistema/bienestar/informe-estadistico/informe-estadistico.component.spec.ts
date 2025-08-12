import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeEstadisticoComponent } from './informe-estadistico.component';

describe('InformeEstadisticoComponent', () => {
  let component: InformeEstadisticoComponent;
  let fixture: ComponentFixture<InformeEstadisticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeEstadisticoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InformeEstadisticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
