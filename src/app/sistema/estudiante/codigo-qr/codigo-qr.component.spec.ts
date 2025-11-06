import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoQrComponent } from './codigo-qr.component';

describe('CodigoQrComponent', () => {
  let component: CodigoQrComponent;
  let fixture: ComponentFixture<CodigoQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodigoQrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodigoQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
