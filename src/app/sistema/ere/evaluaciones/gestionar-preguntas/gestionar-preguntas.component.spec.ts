import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GestionarPreguntasComponent } from './gestionar-preguntas.component'

describe('GestionarPreguntasComponent', () => {
    let component: GestionarPreguntasComponent
    let fixture: ComponentFixture<GestionarPreguntasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GestionarPreguntasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(GestionarPreguntasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
