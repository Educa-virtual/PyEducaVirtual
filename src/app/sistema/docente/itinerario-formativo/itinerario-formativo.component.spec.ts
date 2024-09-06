import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItinerarioFormativoComponent } from './itinerario-formativo.component';

describe('ItinerarioFormativoComponent', () => {
  let component: ItinerarioFormativoComponent;
  let fixture: ComponentFixture<ItinerarioFormativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItinerarioFormativoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItinerarioFormativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
