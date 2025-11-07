import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarLogroComponent } from './configurar-logro.component';

describe('ConfigurarLogroComponent', () => {
  let component: ConfigurarLogroComponent;
  let fixture: ComponentFixture<ConfigurarLogroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurarLogroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurarLogroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
