import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SeguimientoApoderadoComponent } from './seguimiento-apoderado.component'

describe('SeguimientoApoderadoComponent', () => {
    let component: SeguimientoApoderadoComponent
    let fixture: ComponentFixture<SeguimientoApoderadoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SeguimientoApoderadoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(SeguimientoApoderadoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
