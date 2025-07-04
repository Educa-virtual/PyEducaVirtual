import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RespuestaPreguntasEncuestaComponent } from './respuesta-preguntas-encuesta.component'

describe('RespuestaPreguntasEncuestaComponent', () => {
    let component: RespuestaPreguntasEncuestaComponent
    let fixture: ComponentFixture<RespuestaPreguntasEncuestaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RespuestaPreguntasEncuestaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(RespuestaPreguntasEncuestaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
