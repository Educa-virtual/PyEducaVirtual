import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EvaluacionPracticaComponent } from './evaluacion-practica.component'

describe('EvaluacionPracticaComponent', () => {
    let component: EvaluacionPracticaComponent
    let fixture: ComponentFixture<EvaluacionPracticaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EvaluacionPracticaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(EvaluacionPracticaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
