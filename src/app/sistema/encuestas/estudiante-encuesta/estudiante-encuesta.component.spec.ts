import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EstudianteEncuestaComponent } from './estudiante-encuesta.component'

describe('EstudianteEncuestaComponent', () => {
    let component: EstudianteEncuestaComponent
    let fixture: ComponentFixture<EstudianteEncuestaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EstudianteEncuestaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(EstudianteEncuestaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
