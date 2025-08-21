import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardIndicadoresComponent } from './dashboard-indicadores.component';

describe('DashboardIndicadoresComponent', () => {
  let component: DashboardIndicadoresComponent;
  let fixture: ComponentFixture<DashboardIndicadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardIndicadoresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
