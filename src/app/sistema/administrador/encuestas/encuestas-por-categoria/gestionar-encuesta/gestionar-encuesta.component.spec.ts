import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GestionarEncuestaComponent } from './gestionar-encuesta.component'

describe('GestionarEncuestaComponent', () => {
    let component: GestionarEncuestaComponent
    let fixture: ComponentFixture<GestionarEncuestaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GestionarEncuestaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(GestionarEncuestaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
