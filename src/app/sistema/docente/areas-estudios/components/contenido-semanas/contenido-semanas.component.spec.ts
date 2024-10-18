import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ContenidoSemanasComponent } from './contenido-semanas.component'

describe('ContenidoSemanasComponent', () => {
    let component: ContenidoSemanasComponent
    let fixture: ComponentFixture<ContenidoSemanasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContenidoSemanasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ContenidoSemanasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
