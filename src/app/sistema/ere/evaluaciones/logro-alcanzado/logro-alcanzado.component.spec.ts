import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LogroAlcanzadoComponent } from './logro-alcanzado.component'

describe('LogroAlcanzadoComponent', () => {
    let component: LogroAlcanzadoComponent
    let fixture: ComponentFixture<LogroAlcanzadoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LogroAlcanzadoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(LogroAlcanzadoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
