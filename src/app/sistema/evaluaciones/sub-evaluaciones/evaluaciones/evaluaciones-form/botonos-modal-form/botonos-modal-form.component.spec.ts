import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BotonosModalFormComponent } from './botonos-modal-form.component'

describe('BotonosModalFormComponent', () => {
    let component: BotonosModalFormComponent
    let fixture: ComponentFixture<BotonosModalFormComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BotonosModalFormComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(BotonosModalFormComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
