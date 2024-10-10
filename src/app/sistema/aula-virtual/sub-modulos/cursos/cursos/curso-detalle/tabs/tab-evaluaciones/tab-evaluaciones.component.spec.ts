import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TabEvaluacionesComponent } from './tab-evaluaciones.component'

describe('TabEvaluacionesComponent', () => {
    let component: TabEvaluacionesComponent
    let fixture: ComponentFixture<TabEvaluacionesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TabEvaluacionesComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(TabEvaluacionesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
