import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImportarDatosComponent } from './importar-datos.component'

describe('ImportarDatosComponent', () => {
    let component: ImportarDatosComponent
    let fixture: ComponentFixture<ImportarDatosComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImportarDatosComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ImportarDatosComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
