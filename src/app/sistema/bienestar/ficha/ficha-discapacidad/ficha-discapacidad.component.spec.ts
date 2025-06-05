import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FichaDiscapacidadComponent } from './ficha-discapacidad.component'

describe('FichaDiscapacidadComponent', () => {
    let component: FichaDiscapacidadComponent
    let fixture: ComponentFixture<FichaDiscapacidadComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FichaDiscapacidadComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FichaDiscapacidadComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
