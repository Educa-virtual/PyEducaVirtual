import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NewMantenimientoUsuarioComponent } from './new-mantenimiento-usuario.component'

describe('NewMantenimientoUsuarioComponent', () => {
    let component: NewMantenimientoUsuarioComponent
    let fixture: ComponentFixture<NewMantenimientoUsuarioComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewMantenimientoUsuarioComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(NewMantenimientoUsuarioComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
