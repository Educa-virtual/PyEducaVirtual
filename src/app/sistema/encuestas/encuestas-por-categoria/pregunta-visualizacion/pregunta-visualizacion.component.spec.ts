import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PreguntaVisualizacionComponent } from './pregunta-visualizacion.component'

describe('PreguntaVisualizacionComponent', () => {
    let component: PreguntaVisualizacionComponent
    let fixture: ComponentFixture<PreguntaVisualizacionComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PreguntaVisualizacionComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(PreguntaVisualizacionComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
