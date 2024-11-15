import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfigAmbienteComponent } from './config-ambiente.component'

describe('ConfigAmbienteComponent', () => {
    let component: ConfigAmbienteComponent
    let fixture: ComponentFixture<ConfigAmbienteComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigAmbienteComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfigAmbienteComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
