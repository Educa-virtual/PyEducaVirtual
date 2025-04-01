import { ComponentFixture, TestBed } from '@angular/core/testing'
import { EspecialistaDremoComponent } from './especialista-dremo.component'

describe('EspecialistaDremoComponent', () => {
    let component: EspecialistaDremoComponent
    let fixture: ComponentFixture<EspecialistaDremoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EspecialistaDremoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(EspecialistaDremoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
