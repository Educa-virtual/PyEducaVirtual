import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TabsPrimengComponent } from './tabs-primeng.component'

describe('TabsPrimengComponent', () => {
    let component: TabsPrimengComponent
    let fixture: ComponentFixture<TabsPrimengComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TabsPrimengComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(TabsPrimengComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
