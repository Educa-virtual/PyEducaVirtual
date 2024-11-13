import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfigPlanEstudiosComponent } from './config-plan-estudios.component'

describe('ConfigPlanEstudiosComponent', () => {
    let component: ConfigPlanEstudiosComponent
    let fixture: ComponentFixture<ConfigPlanEstudiosComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigPlanEstudiosComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfigPlanEstudiosComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
