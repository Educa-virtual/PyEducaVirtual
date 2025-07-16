import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ActivarMatrizComponent } from './activar-matriz.component'

describe('ActivarMatrizComponent', () => {
    let component: ActivarMatrizComponent
    let fixture: ComponentFixture<ActivarMatrizComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ActivarMatrizComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ActivarMatrizComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
