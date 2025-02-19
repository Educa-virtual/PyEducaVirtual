import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormImportarBancoPreguntasComponent } from './form-importar-banco-preguntas.component'

describe('FormImportarBancoPreguntasComponent', () => {
    let component: FormImportarBancoPreguntasComponent
    let fixture: ComponentFixture<FormImportarBancoPreguntasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormImportarBancoPreguntasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FormImportarBancoPreguntasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
