import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalEvaluacionFinalizadaComponent } from './modal-evaluacion-finalizada.component'

describe('ModalEvaluacionFinalizadaComponent', () => {
    let component: ModalEvaluacionFinalizadaComponent
    let fixture: ComponentFixture<ModalEvaluacionFinalizadaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalEvaluacionFinalizadaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ModalEvaluacionFinalizadaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
