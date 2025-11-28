import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMeritoComponent } from './form-merito.component';

describe('FormMeritoComponent', () => {
  let component: FormMeritoComponent;
  let fixture: ComponentFixture<FormMeritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMeritoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormMeritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
