import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EconomicaComponent } from './economica.component'

describe('EconomicaComponent', () => {
    let component: EconomicaComponent
    let fixture: ComponentFixture<EconomicaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EconomicaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(EconomicaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
