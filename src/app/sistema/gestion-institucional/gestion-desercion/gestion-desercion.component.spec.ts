import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesercionComponent } from './gestion-desercion.component';

describe('GestionDesercionComponent', () => {
  let component: GestionDesercionComponent;
  let fixture: ComponentFixture<GestionDesercionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionDesercionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionDesercionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
