import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSimpleComponent } from './dropdown-simple.component';

describe('DropdownSimpleComponent', () => {
  let component: DropdownSimpleComponent;
  let fixture: ComponentFixture<DropdownSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSimpleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
