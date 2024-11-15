import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfigAsignarGradoComponent } from './config-asignar-grado.component'

describe('ConfigAsignarGradoComponent', () => {
    let component: ConfigAsignarGradoComponent
    let fixture: ComponentFixture<ConfigAsignarGradoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigAsignarGradoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfigAsignarGradoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
