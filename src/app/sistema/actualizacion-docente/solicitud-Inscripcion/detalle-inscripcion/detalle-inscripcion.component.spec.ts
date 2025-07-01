import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DetalleInscripcionComponent } from './detalle-inscripcion.component'

describe('DetalleInscripcionComponent', () => {
    let component: DetalleInscripcionComponent
    let fixture: ComponentFixture<DetalleInscripcionComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DetalleInscripcionComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(DetalleInscripcionComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
