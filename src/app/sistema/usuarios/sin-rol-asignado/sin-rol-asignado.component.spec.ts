import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinRolAsignadoComponent } from './sin-rol-asignado.component';

describe('SinRolAsignadoComponent', () => {
  let component: SinRolAsignadoComponent;
  let fixture: ComponentFixture<SinRolAsignadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinRolAsignadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SinRolAsignadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
