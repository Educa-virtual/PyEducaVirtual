import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PreguntaAbiertaComponent } from './pregunta-abierta.component'

describe('PreguntaAbiertaComponent', () => {
    let component: PreguntaAbiertaComponent
    let fixture: ComponentFixture<PreguntaAbiertaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PreguntaAbiertaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(PreguntaAbiertaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
