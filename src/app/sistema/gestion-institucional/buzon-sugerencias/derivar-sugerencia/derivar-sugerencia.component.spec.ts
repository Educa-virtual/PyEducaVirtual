import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DerivarSugerenciaComponent } from './derivar-sugerencia.component'

describe('DerivarSugerenciaComponent', () => {
    let component: DerivarSugerenciaComponent
    let fixture: ComponentFixture<DerivarSugerenciaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DerivarSugerenciaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(DerivarSugerenciaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
