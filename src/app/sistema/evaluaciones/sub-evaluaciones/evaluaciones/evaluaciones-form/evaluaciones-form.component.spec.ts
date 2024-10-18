import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EvaluacionesFormComponent } from './evaluaciones-form.component'

describe('EvaluacionesFormComponent', () => {
    let component: EvaluacionesFormComponent
    let fixture: ComponentFixture<EvaluacionesFormComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EvaluacionesFormComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(EvaluacionesFormComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
