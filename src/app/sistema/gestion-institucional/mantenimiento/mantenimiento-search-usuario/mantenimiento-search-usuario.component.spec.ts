import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MantenimientoSearchUsuarioComponent } from './mantenimiento-search-usuario.component'

describe('MantenimientoSearchUsuarioComponent', () => {
    let component: MantenimientoSearchUsuarioComponent
    let fixture: ComponentFixture<MantenimientoSearchUsuarioComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MantenimientoSearchUsuarioComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(MantenimientoSearchUsuarioComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
