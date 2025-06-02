import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CardCapacitacionesComponent } from './card-capacitaciones.component'

describe('CardCapacitacionesComponent', () => {
    let component: CardCapacitacionesComponent
    let fixture: ComponentFixture<CardCapacitacionesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardCapacitacionesComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CardCapacitacionesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
