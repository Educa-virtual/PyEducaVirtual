import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AsignarCalendarioComponent } from './asignar-calendario.component'

describe('AsignarCalendarioComponent', () => {
    let component: AsignarCalendarioComponent
    let fixture: ComponentFixture<AsignarCalendarioComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AsignarCalendarioComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(AsignarCalendarioComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
