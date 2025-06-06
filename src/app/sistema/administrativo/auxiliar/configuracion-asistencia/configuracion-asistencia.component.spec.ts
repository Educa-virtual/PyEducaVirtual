import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfiguracionAsistenciaComponent } from './configuracion-asistencia.component'

describe('ConfiguracionAsistenciaComponent', () => {
    let component: ConfiguracionAsistenciaComponent
    let fixture: ComponentFixture<ConfiguracionAsistenciaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfiguracionAsistenciaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfiguracionAsistenciaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
