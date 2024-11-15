import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfigHoraDocenteComponent } from './config-hora-docente.component'

describe('ConfigHoraDocenteComponent', () => {
    let component: ConfigHoraDocenteComponent
    let fixture: ComponentFixture<ConfigHoraDocenteComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigHoraDocenteComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfigHoraDocenteComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
