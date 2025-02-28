import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RegistroApoderadoComponent } from './registro-apoderado.component'

describe('RegistroApoderadoComponent', () => {
    let component: RegistroApoderadoComponent
    let fixture: ComponentFixture<RegistroApoderadoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegistroApoderadoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(RegistroApoderadoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
