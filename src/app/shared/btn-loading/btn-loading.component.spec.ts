import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BtnLoadingComponent } from './btn-loading.component'

describe('BtnLoadingComponent', () => {
    let component: BtnLoadingComponent
    let fixture: ComponentFixture<BtnLoadingComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BtnLoadingComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(BtnLoadingComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
