import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PreguntasCuestionarioComponent } from './preguntas-cuestionario.component'

describe('PreguntasCuestionarioComponent', () => {
    let component: PreguntasCuestionarioComponent
    let fixture: ComponentFixture<PreguntasCuestionarioComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PreguntasCuestionarioComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(PreguntasCuestionarioComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
