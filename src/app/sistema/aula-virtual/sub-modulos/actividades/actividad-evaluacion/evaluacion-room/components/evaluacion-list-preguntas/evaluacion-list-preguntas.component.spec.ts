import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EvaluacionListPreguntasComponent } from './evaluacion-list-preguntas.component'

describe('EvaluacionListPreguntasComponent', () => {
    let component: EvaluacionListPreguntasComponent
    let fixture: ComponentFixture<EvaluacionListPreguntasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EvaluacionListPreguntasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(EvaluacionListPreguntasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
