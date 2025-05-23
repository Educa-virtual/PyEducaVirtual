import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CompetenciasComponent } from './competencias.component'

describe('CompetenciasComponent', () => {
    let component: CompetenciasComponent
    let fixture: ComponentFixture<CompetenciasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompetenciasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CompetenciasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
