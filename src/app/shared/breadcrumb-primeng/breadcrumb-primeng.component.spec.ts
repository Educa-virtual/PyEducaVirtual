import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BreadcrumbPrimengComponent } from './breadcrumb-primeng.component'

describe('BreadcrumbPrimengComponent', () => {
    let component: BreadcrumbPrimengComponent
    let fixture: ComponentFixture<BreadcrumbPrimengComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BreadcrumbPrimengComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(BreadcrumbPrimengComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
