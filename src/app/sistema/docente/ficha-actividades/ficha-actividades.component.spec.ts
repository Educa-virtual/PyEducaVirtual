import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaActividadesComponent } from './ficha-actividades.component';

describe('FichaActividadesComponent', () => {
  let component: FichaActividadesComponent;
  let fixture: ComponentFixture<FichaActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaActividadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
