import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TabInicioComponent } from './tab-inicio.component'

describe('TabInicioComponent', () => {
    let component: TabInicioComponent
    let fixture: ComponentFixture<TabInicioComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TabInicioComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(TabInicioComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
