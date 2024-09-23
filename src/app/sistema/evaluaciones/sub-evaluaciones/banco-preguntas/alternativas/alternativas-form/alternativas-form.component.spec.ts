import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AlternativasFormComponent } from './alternativas-form.component'

describe('AlternativasFormComponent', () => {
    let component: AlternativasFormComponent
    let fixture: ComponentFixture<AlternativasFormComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlternativasFormComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(AlternativasFormComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
