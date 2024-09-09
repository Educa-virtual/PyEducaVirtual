import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasEstudiosComponent } from './areas-estudios.component';

describe('AreasEstudiosComponent', () => {
  let component: AreasEstudiosComponent;
  let fixture: ComponentFixture<AreasEstudiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreasEstudiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreasEstudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
