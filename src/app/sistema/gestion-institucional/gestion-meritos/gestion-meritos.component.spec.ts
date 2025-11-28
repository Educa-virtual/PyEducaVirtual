import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMeritosComponent } from './gestion-meritos.component';

describe('GestionMeritosComponent', () => {
  let component: GestionMeritosComponent;
  let fixture: ComponentFixture<GestionMeritosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMeritosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionMeritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
