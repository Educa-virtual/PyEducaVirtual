import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivarDescargaComponent } from './activar-descarga.component';

describe('ActivarDescargaComponent', () => {
  let component: ActivarDescargaComponent;
  let fixture: ComponentFixture<ActivarDescargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivarDescargaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivarDescargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
