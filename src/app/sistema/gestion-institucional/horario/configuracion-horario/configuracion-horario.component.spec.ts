import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfiguracionHorarioComponent } from './configuracion-horario.component'

describe('ConfiguracionHorarioComponent', () => {
    let component: ConfiguracionHorarioComponent
    let fixture: ComponentFixture<ConfiguracionHorarioComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfiguracionHorarioComponent],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfiguracionHorarioComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
