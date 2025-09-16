import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizarraDigitalComponent } from './pizarra-digital.component';

describe('PizarraDigitalComponent', () => {
  let component: PizarraDigitalComponent;
  let fixture: ComponentFixture<PizarraDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizarraDigitalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PizarraDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
