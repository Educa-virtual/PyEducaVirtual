import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CambiarConstrasenaComponent } from './cambiar-constrasena.component'

describe('CambiarConstrasenaComponent', () => {
    let component: CambiarConstrasenaComponent
    let fixture: ComponentFixture<CambiarConstrasenaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CambiarConstrasenaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CambiarConstrasenaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
