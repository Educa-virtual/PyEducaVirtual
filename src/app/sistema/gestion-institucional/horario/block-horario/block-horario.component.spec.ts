import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BlockHorarioComponent } from './block-horario.component'

describe('BlockHorarioComponent', () => {
    let component: BlockHorarioComponent
    let fixture: ComponentFixture<BlockHorarioComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlockHorarioComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(BlockHorarioComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
