import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesCompararEreComponent } from './informes-comparar-ere.component';

describe('InformesCompararEreComponent', () => {
  let component: InformesCompararEreComponent;
  let fixture: ComponentFixture<InformesCompararEreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformesCompararEreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InformesCompararEreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
