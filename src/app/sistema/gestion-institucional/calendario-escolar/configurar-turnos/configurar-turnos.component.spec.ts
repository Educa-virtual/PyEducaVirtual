import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarTurnosComponent } from './configurar-turnos.component';

describe('ConfigurarTurnosComponent', () => {
  let component: ConfigurarTurnosComponent;
  let fixture: ComponentFixture<ConfigurarTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurarTurnosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurarTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
