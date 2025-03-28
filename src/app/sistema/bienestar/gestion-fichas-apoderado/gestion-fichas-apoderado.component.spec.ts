import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FichavistapoderadoComponent } from './fichavistapoderado.component'

describe('FichavistapoderadoComponent', () => {
    let component: FichavistapoderadoComponent
    let fixture: ComponentFixture<FichavistapoderadoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FichavistapoderadoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FichavistapoderadoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
