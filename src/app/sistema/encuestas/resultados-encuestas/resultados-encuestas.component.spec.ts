import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResultadosEncuestasComponent } from './resultados-encuestas.component'

describe('ResultadosEncuestasComponent', () => {
    let component: ResultadosEncuestasComponent
    let fixture: ComponentFixture<ResultadosEncuestasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ResultadosEncuestasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ResultadosEncuestasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
