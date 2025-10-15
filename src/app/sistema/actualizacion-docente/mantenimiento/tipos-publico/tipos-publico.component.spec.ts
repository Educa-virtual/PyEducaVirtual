import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposPublicoComponent } from './tipos-publico.component';

describe('TiposPublicoComponent', () => {
  let component: TiposPublicoComponent;
  let fixture: ComponentFixture<TiposPublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposPublicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TiposPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
