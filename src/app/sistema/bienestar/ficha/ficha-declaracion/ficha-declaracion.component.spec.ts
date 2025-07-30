import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaDeclaracionComponent } from './ficha-declaracion.component';

describe('FichaDeclaracionComponent', () => {
  let component: FichaDeclaracionComponent;
  let fixture: ComponentFixture<FichaDeclaracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaDeclaracionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaDeclaracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
