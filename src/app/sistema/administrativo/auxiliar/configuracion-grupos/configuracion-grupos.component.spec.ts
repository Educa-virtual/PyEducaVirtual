import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfiguracionGruposComponent } from './configuracion-grupos.component'

describe('ConfiguracionGruposComponent', () => {
    let component: ConfiguracionGruposComponent
    let fixture: ComponentFixture<ConfiguracionGruposComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfiguracionGruposComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfiguracionGruposComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
