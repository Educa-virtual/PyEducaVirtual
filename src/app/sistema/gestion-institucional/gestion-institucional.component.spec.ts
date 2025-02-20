import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GestionInstitucionalComponent } from './gestion-institucional.component'

describe('GestionInstitucionalComponent', () => {
    let component: GestionInstitucionalComponent
    let fixture: ComponentFixture<GestionInstitucionalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GestionInstitucionalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(GestionInstitucionalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
