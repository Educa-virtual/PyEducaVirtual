import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AgregarPersonalPlataformaComponent } from './agregar-personal-plataforma.component'

describe('AgregarPersonalPlataformaComponent', () => {
    let component: AgregarPersonalPlataformaComponent
    let fixture: ComponentFixture<AgregarPersonalPlataformaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AgregarPersonalPlataformaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(AgregarPersonalPlataformaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
