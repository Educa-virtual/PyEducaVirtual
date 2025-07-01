import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BandejaEstudianteComponent } from './bandeja-estudiante.component'

describe('BandejaEstudianteComponent', () => {
    let component: BandejaEstudianteComponent
    let fixture: ComponentFixture<BandejaEstudianteComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BandejaEstudianteComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(BandejaEstudianteComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
