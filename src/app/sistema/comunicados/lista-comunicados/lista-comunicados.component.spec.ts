import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarComunicadosComponent } from './listar-comunicados.component';

describe('ListarComunicadosComponent', () => {
  let component: ListarComunicadosComponent;
  let fixture: ComponentFixture<ListarComunicadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarComunicadosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarComunicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
