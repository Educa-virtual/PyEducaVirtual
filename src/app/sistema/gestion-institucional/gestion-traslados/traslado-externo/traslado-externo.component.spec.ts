import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TrasladoExternoComponent } from './traslado-externo.component'

describe('TrasladoExternoComponent', () => {
    let component: TrasladoExternoComponent
    let fixture: ComponentFixture<TrasladoExternoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TrasladoExternoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(TrasladoExternoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
