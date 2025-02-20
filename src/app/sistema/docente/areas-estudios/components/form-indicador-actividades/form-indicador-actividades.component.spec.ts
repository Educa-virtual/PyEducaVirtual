import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormIndicadorActividadesComponent } from './form-indicador-actividades.component'

describe('FormIndicadorActividadesComponent', () => {
    let component: FormIndicadorActividadesComponent
    let fixture: ComponentFixture<FormIndicadorActividadesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormIndicadorActividadesComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FormIndicadorActividadesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
