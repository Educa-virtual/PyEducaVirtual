import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaSaludComponent } from './ficha-salud.component';

describe('FichaSaludComponent', () => {
  let component: FichaSaludComponent;
  let fixture: ComponentFixture<FichaSaludComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaSaludComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaSaludComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
