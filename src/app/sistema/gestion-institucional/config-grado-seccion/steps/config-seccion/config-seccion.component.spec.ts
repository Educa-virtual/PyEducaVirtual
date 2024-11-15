import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfigSeccionComponent } from './config-seccion.component'

describe('ConfigSeccionComponent', () => {
    let component: ConfigSeccionComponent
    let fixture: ComponentFixture<ConfigSeccionComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigSeccionComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfigSeccionComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
