import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MatriculaIndividualComponent } from './matricula-individual.component'

describe('MatriculaIndividualComponent', () => {
    let component: MatriculaIndividualComponent
    let fixture: ComponentFixture<MatriculaIndividualComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatriculaIndividualComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(MatriculaIndividualComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
