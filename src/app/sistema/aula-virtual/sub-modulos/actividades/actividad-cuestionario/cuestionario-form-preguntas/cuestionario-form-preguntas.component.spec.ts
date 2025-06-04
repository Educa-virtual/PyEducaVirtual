import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CuestionarioFormPreguntasComponent } from './cuestionario-form-preguntas.component'

describe('CuestionarioFormPreguntasComponent', () => {
    let component: CuestionarioFormPreguntasComponent
    let fixture: ComponentFixture<CuestionarioFormPreguntasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CuestionarioFormPreguntasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CuestionarioFormPreguntasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
