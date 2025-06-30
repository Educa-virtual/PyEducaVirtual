import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NivelPobrezaComponent } from './nivel-pobreza.component'

describe('NivelPobrezaComponent', () => {
    let component: NivelPobrezaComponent
    let fixture: ComponentFixture<NivelPobrezaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NivelPobrezaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(NivelPobrezaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
