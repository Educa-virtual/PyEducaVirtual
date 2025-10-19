import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicadoComponent } from './comunicado.component';

describe('ComunicadoComponent', () => {
  let component: ComunicadoComponent;
  let fixture: ComponentFixture<ComunicadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunicadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComunicadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
