import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AreasRendirExamenComponent } from './areas-rendir-examen.component'

describe('AreasRendirExamenComponent', () => {
    let component: AreasRendirExamenComponent
    let fixture: ComponentFixture<AreasRendirExamenComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AreasRendirExamenComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(AreasRendirExamenComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
