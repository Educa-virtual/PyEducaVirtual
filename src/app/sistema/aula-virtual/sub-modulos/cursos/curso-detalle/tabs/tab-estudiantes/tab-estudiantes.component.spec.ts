import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TabEstudiantesComponent } from './tab-estudiantes.component'

describe('TabEstudiantesComponent', () => {
    let component: TabEstudiantesComponent
    let fixture: ComponentFixture<TabEstudiantesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TabEstudiantesComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(TabEstudiantesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
