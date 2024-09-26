import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormMetodologiaComponent } from './form-metodologia.component'

describe('FormMetodologiaComponent', () => {
    let component: FormMetodologiaComponent
    let fixture: ComponentFixture<FormMetodologiaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormMetodologiaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FormMetodologiaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
