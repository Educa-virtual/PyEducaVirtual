import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PreguntasActivasComponent } from './preguntas-activas.component'

describe('PreguntasActivasComponent', () => {
    let component: PreguntasActivasComponent
    let fixture: ComponentFixture<PreguntasActivasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PreguntasActivasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(PreguntasActivasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
