import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfigResumenComponent } from './config-resumen.component'

describe('ConfigResumenComponent', () => {
    let component: ConfigResumenComponent
    let fixture: ComponentFixture<ConfigResumenComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigResumenComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfigResumenComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
