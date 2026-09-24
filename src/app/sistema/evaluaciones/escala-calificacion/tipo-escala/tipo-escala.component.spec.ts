import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEscalaComponent } from './tipo-escala.component';

describe('TipoEscalaComponent', () => {
  let component: TipoEscalaComponent;
  let fixture: ComponentFixture<TipoEscalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoEscalaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoEscalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
