import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonDirectorComponent } from './buzon-director.component';

describe('BuzonDirectorComponent', () => {
  let component: BuzonDirectorComponent;
  let fixture: ComponentFixture<BuzonDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuzonDirectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuzonDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
