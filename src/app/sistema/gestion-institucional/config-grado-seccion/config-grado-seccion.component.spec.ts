import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfigGradoSeccionComponent } from './config-grado-seccion.component'

describe('ConfigGradoSeccionComponent', () => {
    let component: ConfigGradoSeccionComponent
    let fixture: ComponentFixture<ConfigGradoSeccionComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigGradoSeccionComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfigGradoSeccionComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
