import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TabmaenuPreguntaRespuestaComponent } from './tabmaenu-pregunta-respuesta.component'

describe('TabmaenuPreguntaRespuestaComponent', () => {
    let component: TabmaenuPreguntaRespuestaComponent
    let fixture: ComponentFixture<TabmaenuPreguntaRespuestaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TabmaenuPreguntaRespuestaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(TabmaenuPreguntaRespuestaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
