import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NuevaEncuestaComponent } from './nueva-encuesta.component'

describe('NuevaEncuestaComponent', () => {
    let component: NuevaEncuestaComponent
    let fixture: ComponentFixture<NuevaEncuestaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NuevaEncuestaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(NuevaEncuestaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
