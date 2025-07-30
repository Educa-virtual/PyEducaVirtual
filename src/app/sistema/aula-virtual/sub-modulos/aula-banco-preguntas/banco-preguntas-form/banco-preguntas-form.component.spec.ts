import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancoPreguntasFormComponent } from './banco-preguntas-form.component';

describe('BancoPreguntasFormComponent', () => {
  let component: BancoPreguntasFormComponent;
  let fixture: ComponentFixture<BancoPreguntasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BancoPreguntasFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BancoPreguntasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
