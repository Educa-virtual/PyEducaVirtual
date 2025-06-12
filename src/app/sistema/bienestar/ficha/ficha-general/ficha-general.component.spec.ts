import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FichasocgeneralComponent } from './fichasocgeneral.component'

describe('FichasocgeneralComponent', () => {
    let component: FichasocgeneralComponent
    let fixture: ComponentFixture<FichasocgeneralComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FichasocgeneralComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(FichasocgeneralComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
