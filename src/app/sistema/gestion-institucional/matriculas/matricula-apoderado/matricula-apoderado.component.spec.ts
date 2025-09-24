import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaApoderadoComponent } from './matricula-apoderado.component';

describe('MatriculaApoderadoComponent', () => {
  let component: MatriculaApoderadoComponent;
  let fixture: ComponentFixture<MatriculaApoderadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriculaApoderadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatriculaApoderadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
