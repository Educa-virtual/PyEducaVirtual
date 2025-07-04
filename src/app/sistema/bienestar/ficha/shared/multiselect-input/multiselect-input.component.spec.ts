import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MultiselectInputComponent } from './multiselect-input.component'

describe('MultiselectInputComponent', () => {
    let component: MultiselectInputComponent
    let fixture: ComponentFixture<MultiselectInputComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MultiselectInputComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(MultiselectInputComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
