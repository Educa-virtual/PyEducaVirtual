import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MatriculaMasivaComponent } from './matricula-masiva.component'

describe('MatriculaMasivaComponent', () => {
    let component: MatriculaMasivaComponent
    let fixture: ComponentFixture<MatriculaMasivaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatriculaMasivaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(MatriculaMasivaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
