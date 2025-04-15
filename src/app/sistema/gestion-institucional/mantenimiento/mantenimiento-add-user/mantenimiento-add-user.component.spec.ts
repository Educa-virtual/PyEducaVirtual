import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MantenimientoAddUserComponent } from './mantenimiento-add-user.component'

describe('MantenimientoAddUserComponent', () => {
    let component: MantenimientoAddUserComponent
    let fixture: ComponentFixture<MantenimientoAddUserComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MantenimientoAddUserComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(MantenimientoAddUserComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
