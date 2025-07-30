import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaFamiliaRegistroComponent } from './ficha-familia-registro.component';

describe('FichaFamiliaRegistroComponent', () => {
  let component: FichaFamiliaRegistroComponent;
  let fixture: ComponentFixture<FichaFamiliaRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaFamiliaRegistroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaFamiliaRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
