import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOrderlistIeComponent } from './card-orderlist-ie.component';

describe('CardOrderlistIeComponent', () => {
  let component: CardOrderlistIeComponent;
  let fixture: ComponentFixture<CardOrderlistIeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOrderlistIeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardOrderlistIeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
