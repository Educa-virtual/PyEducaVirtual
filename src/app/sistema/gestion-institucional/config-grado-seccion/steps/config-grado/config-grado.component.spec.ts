import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfigGradoComponent } from './config-grado.component'

describe('ConfigGradoComponent', () => {
    let component: ConfigGradoComponent
    let fixture: ComponentFixture<ConfigGradoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigGradoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ConfigGradoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
