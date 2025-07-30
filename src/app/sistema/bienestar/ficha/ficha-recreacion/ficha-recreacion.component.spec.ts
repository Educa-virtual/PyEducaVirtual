import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaRecreacionComponent } from './ficha-recreacion.component';

describe('FichaRecreacionComponent', () => {
  let component: FichaRecreacionComponent;
  let fixture: ComponentFixture<FichaRecreacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaRecreacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaRecreacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
