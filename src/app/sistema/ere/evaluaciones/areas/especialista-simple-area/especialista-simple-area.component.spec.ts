import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EspecialistaSimpleAreaComponent } from './especialista-simple-area.component'

describe('EspecialistaSimpleAreaComponent', () => {
    let component: EspecialistaSimpleAreaComponent
    let fixture: ComponentFixture<EspecialistaSimpleAreaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EspecialistaSimpleAreaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(EspecialistaSimpleAreaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
