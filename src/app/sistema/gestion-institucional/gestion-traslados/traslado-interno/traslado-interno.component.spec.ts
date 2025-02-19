import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TrasladoInternoComponent } from './traslado-interno.component'

describe('TrasladoInternoComponent', () => {
    let component: TrasladoInternoComponent
    let fixture: ComponentFixture<TrasladoInternoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TrasladoInternoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(TrasladoInternoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
