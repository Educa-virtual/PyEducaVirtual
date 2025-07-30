import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchSimpleComponent } from './switch-simple.component';

describe('SwitchSimpleComponent', () => {
  let component: SwitchSimpleComponent;
  let fixture: ComponentFixture<SwitchSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchSimpleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
