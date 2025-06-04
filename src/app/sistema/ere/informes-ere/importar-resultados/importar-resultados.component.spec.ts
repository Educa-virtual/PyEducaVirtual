import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImportarResultadosComponent } from './importar-resultados.component'

describe('ImportarResultadosComponent', () => {
    let component: ImportarResultadosComponent
    let fixture: ComponentFixture<ImportarResultadosComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImportarResultadosComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ImportarResultadosComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
