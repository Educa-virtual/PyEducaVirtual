import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EncuestasPorCategoriaComponent } from './encuestas-por-categoria.component'

describe('EncuestasPorCategoriaComponent', () => {
    let component: EncuestasPorCategoriaComponent
    let fixture: ComponentFixture<EncuestasPorCategoriaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EncuestasPorCategoriaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(EncuestasPorCategoriaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
