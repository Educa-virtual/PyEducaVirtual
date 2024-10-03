import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormContenidoSemanasComponent } from './form-contenido-semanas.component'

describe('FormContenidoSemanasComponent', () => {
    let component: FormContenidoSemanasComponent
    let fixture: ComponentFixture<FormContenidoSemanasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormContenidoSemanasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FormContenidoSemanasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
