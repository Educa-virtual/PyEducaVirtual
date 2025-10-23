import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialCategoriasComponent } from './tutorial-categorias.component';

describe('TutorialCategoriasComponent', () => {
  let component: TutorialCategoriasComponent;
  let fixture: ComponentFixture<TutorialCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialCategoriasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
