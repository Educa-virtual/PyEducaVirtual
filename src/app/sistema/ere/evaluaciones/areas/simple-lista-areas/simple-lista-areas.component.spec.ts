import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SimpleListaAreasComponent } from './simple-lista-areas.component'

describe('SimpleListaAreasComponent', () => {
    let component: SimpleListaAreasComponent
    let fixture: ComponentFixture<SimpleListaAreasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SimpleListaAreasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(SimpleListaAreasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
