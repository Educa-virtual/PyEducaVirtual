import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoBienestarComponent } from './seguimiento-bienestar.component';

describe('SeguimientoBienestarComponent', () => {
  let component: SeguimientoBienestarComponent;
  let fixture: ComponentFixture<SeguimientoBienestarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoBienestarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguimientoBienestarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
