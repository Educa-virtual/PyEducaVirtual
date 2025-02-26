import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BuzonSugerenciasComponent } from './buzon-sugerencias.component'

describe('BuzonSugerenciasComponent', () => {
    let component: BuzonSugerenciasComponent
    let fixture: ComponentFixture<BuzonSugerenciasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BuzonSugerenciasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(BuzonSugerenciasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
