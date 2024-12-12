import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelGraficoComponent } from './panel-grafico.component'

describe('PanelGraficoComponent', () => {
    let component: PanelGraficoComponent
    let fixture: ComponentFixture<PanelGraficoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PanelGraficoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(PanelGraficoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
