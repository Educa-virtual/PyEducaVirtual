import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigFechasComponent } from './config-fechas.component';

describe('ConfigFechasComponent', () => {
  let component: ConfigFechasComponent;
  let fixture: ComponentFixture<ConfigFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigFechasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
