import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormLiberarAreasUgelComponent } from './form-liberar-areas-ugel.component'

describe('FormLiberarAreasUgelComponent', () => {
    let component: FormLiberarAreasUgelComponent
    let fixture: ComponentFixture<FormLiberarAreasUgelComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormLiberarAreasUgelComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FormLiberarAreasUgelComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
