import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDescrpcionActividadesComponent } from './tab-descripcion-actividades.component';

describe('TabDescrpcionActividadesComponent', () => {
  let component: TabDescrpcionActividadesComponent;
  let fixture: ComponentFixture<TabDescrpcionActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabDescrpcionActividadesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabDescrpcionActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
