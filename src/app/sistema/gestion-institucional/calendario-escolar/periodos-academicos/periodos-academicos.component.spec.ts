import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodosAcademicosComponent } from './periodos-academicos.component';

describe('PeriodosAcademicosComponent', () => {
  let component: PeriodosAcademicosComponent;
  let fixture: ComponentFixture<PeriodosAcademicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodosAcademicosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeriodosAcademicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
