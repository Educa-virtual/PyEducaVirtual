import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BotonesModalFormComponent } from './botones-modal-form.component'

describe('BotonesModalFormComponent', () => {
    let component: BotonesModalFormComponent
    let fixture: ComponentFixture<BotonesModalFormComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BotonesModalFormComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(BotonesModalFormComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
