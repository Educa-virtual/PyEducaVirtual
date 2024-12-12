import { ComponentFixture, TestBed } from '@angular/core/testing'

import { IesPersonalComponent } from './ies-personal.component'

describe('IesPersonalComponent', () => {
    let component: IesPersonalComponent
    let fixture: ComponentFixture<IesPersonalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IesPersonalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(IesPersonalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
