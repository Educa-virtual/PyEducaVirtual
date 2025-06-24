import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PoblacionObjetivoComponent } from './poblacion-objetivo.component'

describe('PoblacionObjetivoComponent', () => {
    let component: PoblacionObjetivoComponent
    let fixture: ComponentFixture<PoblacionObjetivoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PoblacionObjetivoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(PoblacionObjetivoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
