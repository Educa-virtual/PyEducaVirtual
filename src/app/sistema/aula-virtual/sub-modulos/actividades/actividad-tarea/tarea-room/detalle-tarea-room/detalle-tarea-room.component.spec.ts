import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTareaRoomComponent } from './detalle-tarea-room.component';

describe('DetalleTareaRoomComponent', () => {
  let component: DetalleTareaRoomComponent;
  let fixture: ComponentFixture<DetalleTareaRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleTareaRoomComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleTareaRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
