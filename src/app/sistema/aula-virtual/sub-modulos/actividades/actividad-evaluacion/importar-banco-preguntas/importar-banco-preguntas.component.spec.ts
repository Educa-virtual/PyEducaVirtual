import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarBancoPreguntasComponent } from './importar-banco-preguntas.component';

describe('ImportarBancoPreguntasComponent', () => {
  let component: ImportarBancoPreguntasComponent;
  let fixture: ComponentFixture<ImportarBancoPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportarBancoPreguntasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportarBancoPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
