import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ListarCapacitacionesComponent } from './listar-capacitaciones.component'

describe('ListarCapacitacionesComponent', () => {
    let component: ListarCapacitacionesComponent
    let fixture: ComponentFixture<ListarCapacitacionesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListarCapacitacionesComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ListarCapacitacionesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
