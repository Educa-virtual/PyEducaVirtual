import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RecordatorioFechasComponent } from './recordatorio-fechas.component'

describe('RecordatorioFechasComponent', () => {
    let component: RecordatorioFechasComponent
    let fixture: ComponentFixture<RecordatorioFechasComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RecordatorioFechasComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(RecordatorioFechasComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
