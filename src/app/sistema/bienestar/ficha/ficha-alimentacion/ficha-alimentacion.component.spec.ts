import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAlimentacionComponent } from './ficha-alimentacion.component';

describe('FichaAlimentacionComponent', () => {
  let component: FichaAlimentacionComponent;
  let fixture: ComponentFixture<FichaAlimentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaAlimentacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaAlimentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
