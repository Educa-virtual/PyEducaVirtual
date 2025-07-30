import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarHorasAreasComponent } from './asignar-horas-areas.component';

describe('AsignarHorasAreasComponent', () => {
  let component: AsignarHorasAreasComponent;
  let fixture: ComponentFixture<AsignarHorasAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarHorasAreasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignarHorasAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
