import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AccesoEncuestaComponent } from './acceso-encuesta.component'

describe('AccesoEncuestaComponent', () => {
    let component: AccesoEncuestaComponent
    let fixture: ComponentFixture<AccesoEncuestaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccesoEncuestaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(AccesoEncuestaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
