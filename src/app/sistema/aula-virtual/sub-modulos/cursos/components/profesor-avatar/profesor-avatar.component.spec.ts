import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfesorAvatarComponent } from './profesor-avatar.component'

describe('ProfesorAvatarComponent', () => {
    let component: ProfesorAvatarComponent
    let fixture: ComponentFixture<ProfesorAvatarComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfesorAvatarComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ProfesorAvatarComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
