import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CuestionarioResultadosComponent } from './cuestionario-resultados.component'

describe('CuestionarioResultadosComponent', () => {
    let component: CuestionarioResultadosComponent
    let fixture: ComponentFixture<CuestionarioResultadosComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CuestionarioResultadosComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CuestionarioResultadosComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
