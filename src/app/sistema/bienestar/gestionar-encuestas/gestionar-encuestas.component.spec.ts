import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GestionarEncuestasComponent } from './gestionar-encuestas.component'

describe('GestionarEncuestasComponent', () => {
    let component: GestionarEncuestasComponent
    let fixture: ComponentFixture<GestionarEncuestasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GestionarEncuestasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(GestionarEncuestasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
