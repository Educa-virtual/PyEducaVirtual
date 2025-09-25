import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculaCursoComponent } from './curricula-curso.component';

describe('CurriculaCursoComponent', () => {
  let component: CurriculaCursoComponent;
  let fixture: ComponentFixture<CurriculaCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculaCursoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurriculaCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
