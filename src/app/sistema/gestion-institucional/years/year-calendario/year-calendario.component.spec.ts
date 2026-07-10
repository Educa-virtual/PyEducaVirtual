import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearConfiguracionComponent } from './year-calendario.component';

describe('YearConfiguracionComponent', () => {
  let component: YearConfiguracionComponent;
  let fixture: ComponentFixture<YearConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearConfiguracionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YearConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
