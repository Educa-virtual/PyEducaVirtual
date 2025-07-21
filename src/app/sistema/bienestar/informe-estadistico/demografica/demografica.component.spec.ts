import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DemograficaComponent } from './demografica.component'

describe('DemograficaComponent', () => {
    let component: DemograficaComponent
    let fixture: ComponentFixture<DemograficaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DemograficaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(DemograficaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
