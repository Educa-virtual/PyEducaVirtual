import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GestionPandemiaDosisComponent } from './gestion-pandemia-dosis.component'

describe('GestionPandemiaDosisComponent', () => {
    let component: GestionPandemiaDosisComponent
    let fixture: ComponentFixture<GestionPandemiaDosisComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GestionPandemiaDosisComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(GestionPandemiaDosisComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
