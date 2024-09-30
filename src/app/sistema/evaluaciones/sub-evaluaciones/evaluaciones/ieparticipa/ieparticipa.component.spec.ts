import { ComponentFixture, TestBed } from '@angular/core/testing'

import { IeparticipaComponent } from './ieparticipa.component'

describe('IeparticipaComponent', () => {
    let component: IeparticipaComponent
    let fixture: ComponentFixture<IeparticipaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IeparticipaComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(IeparticipaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
