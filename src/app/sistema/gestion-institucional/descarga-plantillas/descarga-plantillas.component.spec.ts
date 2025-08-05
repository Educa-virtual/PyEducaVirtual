import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaPlantillasComponent } from './descarga-plantillas.component';

describe('DescargaPlantillasComponent', () => {
  let component: DescargaPlantillasComponent;
  let fixture: ComponentFixture<DescargaPlantillasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescargaPlantillasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DescargaPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
