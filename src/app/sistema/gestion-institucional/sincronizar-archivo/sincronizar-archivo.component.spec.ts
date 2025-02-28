import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SincronizarArchivoComponent } from './sincronizar-archivo.component'

describe('SincronizarArchivoComponent', () => {
    let component: SincronizarArchivoComponent
    let fixture: ComponentFixture<SincronizarArchivoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SincronizarArchivoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(SincronizarArchivoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
