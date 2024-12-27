import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GridHorarioComponent } from './grid-horario.component'

describe('GridHorarioComponent', () => {
    let component: GridHorarioComponent
    let fixture: ComponentFixture<GridHorarioComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GridHorarioComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(GridHorarioComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
