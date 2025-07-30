import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialistaUgelComponent } from './especialista-ugel.component';

describe('EspecialistaUgelComponent', () => {
  let component: EspecialistaUgelComponent;
  let fixture: ComponentFixture<EspecialistaUgelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialistaUgelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EspecialistaUgelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
