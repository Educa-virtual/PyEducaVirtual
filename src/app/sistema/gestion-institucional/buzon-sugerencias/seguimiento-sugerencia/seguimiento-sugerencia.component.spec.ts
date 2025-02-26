import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SeguimientoSugerenciaComponent } from './seguimiento-sugerencia.component'

describe('SeguimientoSugerenciaComponent', () => {
    let component: SeguimientoSugerenciaComponent
    let fixture: ComponentFixture<SeguimientoSugerenciaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SeguimientoSugerenciaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(SeguimientoSugerenciaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
