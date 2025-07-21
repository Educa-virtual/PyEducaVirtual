import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DirectorVerSugerenciaComponent } from './director-ver-sugerencia.component'

describe('DirectorVerSugerenciaComponent', () => {
    let component: DirectorVerSugerenciaComponent
    let fixture: ComponentFixture<DirectorVerSugerenciaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DirectorVerSugerenciaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(DirectorVerSugerenciaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
