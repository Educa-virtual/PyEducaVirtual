import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ActividadEstudiantesTareaRoomComponent } from './actividad-estudiantes-tarea-room.component'

describe('ActividadEstudiantesTareaRoomComponent', () => {
    let component: ActividadEstudiantesTareaRoomComponent
    let fixture: ComponentFixture<ActividadEstudiantesTareaRoomComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ActividadEstudiantesTareaRoomComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(
            ActividadEstudiantesTareaRoomComponent
        )
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
