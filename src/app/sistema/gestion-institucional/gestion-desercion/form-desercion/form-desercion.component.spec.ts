import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesercionComponent } from './form-desercion.component';

describe('FormDesercionComponent', () => {
  let component: FormDesercionComponent;
  let fixture: ComponentFixture<FormDesercionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDesercionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDesercionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
