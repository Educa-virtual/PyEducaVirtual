import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EncuestaPreguntaAbiertaComponent } from './encuesta-pregunta-abierta.component'

describe('EncuestaPreguntaAbiertaComponent', () => {
    let component: EncuestaPreguntaAbiertaComponent
    let fixture: ComponentFixture<EncuestaPreguntaAbiertaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EncuestaPreguntaAbiertaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(EncuestaPreguntaAbiertaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
