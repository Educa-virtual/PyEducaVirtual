import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GestionEncuestaConfiguracionComponent } from './gestion-encuesta-configuracion.component'

describe('GestionEncuestaConfiguracionComponent', () => {
    let component: GestionEncuestaConfiguracionComponent
    let fixture: ComponentFixture<GestionEncuestaConfiguracionComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GestionEncuestaConfiguracionComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(GestionEncuestaConfiguracionComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
