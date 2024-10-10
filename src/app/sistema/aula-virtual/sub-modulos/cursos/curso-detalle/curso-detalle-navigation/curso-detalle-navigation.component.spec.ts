import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CursoDetalleNavigationComponent } from './curso-detalle-navigation.component'

describe('CursoDetalleNavigationComponent', () => {
    let component: CursoDetalleNavigationComponent
    let fixture: ComponentFixture<CursoDetalleNavigationComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CursoDetalleNavigationComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CursoDetalleNavigationComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
