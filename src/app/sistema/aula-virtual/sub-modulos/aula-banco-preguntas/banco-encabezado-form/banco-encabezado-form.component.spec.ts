import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BancoEncabezadoFormComponent } from './banco-encabezado-form.component'

describe('BancoEncabezadoFormComponent', () => {
    let component: BancoEncabezadoFormComponent
    let fixture: ComponentFixture<BancoEncabezadoFormComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BancoEncabezadoFormComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(BancoEncabezadoFormComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
