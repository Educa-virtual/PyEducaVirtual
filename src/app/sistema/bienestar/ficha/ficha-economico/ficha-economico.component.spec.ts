import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaEconomicoComponent } from './ficha-economico.component';

describe('FichaEconomicoComponent', () => {
  let component: FichaEconomicoComponent;
  let fixture: ComponentFixture<FichaEconomicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaEconomicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaEconomicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
