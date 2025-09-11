import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadNoLectivaComponent } from './actividad-no-lectiva.component';

describe('ActividadNoLectivaComponent', () => {
  let component: ActividadNoLectivaComponent;
  let fixture: ComponentFixture<ActividadNoLectivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadNoLectivaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActividadNoLectivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
