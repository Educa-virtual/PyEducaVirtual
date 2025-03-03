import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FichaViviendaComponent } from './ficha-vivienda.component'

describe('FichaViviendaComponent', () => {
    let component: FichaViviendaComponent
    let fixture: ComponentFixture<FichaViviendaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FichaViviendaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FichaViviendaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
