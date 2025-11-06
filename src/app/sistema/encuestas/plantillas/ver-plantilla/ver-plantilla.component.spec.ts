import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPlantillaComponent } from './ver-plantilla.component';

describe('VerPlantillaComponent', () => {
  let component: VerPlantillaComponent;
  let fixture: ComponentFixture<VerPlantillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerPlantillaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
