import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfiguracionEncuestasComponent } from './configuracion-encuestas.component'

describe('ConfiguracionEncuestasComponent', () => {
    let component: ConfiguracionEncuestasComponent
    let fixture: ComponentFixture<ConfiguracionEncuestasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfiguracionEncuestasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfiguracionEncuestasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
