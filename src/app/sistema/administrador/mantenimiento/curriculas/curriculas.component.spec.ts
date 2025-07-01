import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EnlacesAyudaComponent } from './enlaces-ayuda.component'

describe('EnlacesAyudaComponent', () => {
    let component: EnlacesAyudaComponent
    let fixture: ComponentFixture<EnlacesAyudaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EnlacesAyudaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(EnlacesAyudaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
