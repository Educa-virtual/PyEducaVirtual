import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VerBancoPreguntaComponent } from './ver-banco-pregunta.component'

describe('VerBancoPreguntaComponent', () => {
    let component: VerBancoPreguntaComponent
    let fixture: ComponentFixture<VerBancoPreguntaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VerBancoPreguntaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(VerBancoPreguntaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
