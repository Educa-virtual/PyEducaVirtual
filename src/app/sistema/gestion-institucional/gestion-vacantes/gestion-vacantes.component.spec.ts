import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GestionVacantesComponent } from './gestion-vacantes.component'

describe('GestionVacantesComponent', () => {
    let component: GestionVacantesComponent
    let fixture: ComponentFixture<GestionVacantesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GestionVacantesComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(GestionVacantesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
