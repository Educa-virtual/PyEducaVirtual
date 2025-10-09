import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiRepositorioComponent } from './mi-repositorio.component';

describe('MiRepositorioComponent', () => {
  let component: MiRepositorioComponent;
  let fixture: ComponentFixture<MiRepositorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiRepositorioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiRepositorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
