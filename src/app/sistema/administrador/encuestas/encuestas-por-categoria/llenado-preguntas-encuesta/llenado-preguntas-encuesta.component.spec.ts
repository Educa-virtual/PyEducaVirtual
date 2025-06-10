import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LlenadoPreguntasEncuestaComponent } from './llenado-preguntas-encuesta.component'

describe('LlenadoPreguntasEncuestaComponent', () => {
    let component: LlenadoPreguntasEncuestaComponent
    let fixture: ComponentFixture<LlenadoPreguntasEncuestaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LlenadoPreguntasEncuestaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(LlenadoPreguntasEncuestaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
