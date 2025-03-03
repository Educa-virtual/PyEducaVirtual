import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FichaFamiliaComponent } from './ficha-familia.component'

describe('FichaFamiliaComponent', () => {
    let component: FichaFamiliaComponent
    let fixture: ComponentFixture<FichaFamiliaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FichaFamiliaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FichaFamiliaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
