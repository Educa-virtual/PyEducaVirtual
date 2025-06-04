import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AsignarRolPersonalComponent } from './asignar-rol-personal.component'

describe('AsignarRolPersonalComponent', () => {
    let component: AsignarRolPersonalComponent
    let fixture: ComponentFixture<AsignarRolPersonalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AsignarRolPersonalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(AsignarRolPersonalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
