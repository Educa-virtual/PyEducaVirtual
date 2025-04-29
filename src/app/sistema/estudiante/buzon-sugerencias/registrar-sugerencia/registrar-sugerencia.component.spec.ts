import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RegistrarSugerenciaComponent } from './registrar-sugerencia.component'

describe('RegistrarSugerenciaComponent', () => {
    let component: RegistrarSugerenciaComponent
    let fixture: ComponentFixture<RegistrarSugerenciaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegistrarSugerenciaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(RegistrarSugerenciaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
