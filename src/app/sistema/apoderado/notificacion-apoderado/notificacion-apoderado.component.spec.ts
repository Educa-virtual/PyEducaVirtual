import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificacionApoderadoComponent } from './notificacion-apoderado.component'

describe('NotificacionApoderadoComponent', () => {
    let component: NotificacionApoderadoComponent
    let fixture: ComponentFixture<NotificacionApoderadoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificacionApoderadoComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(NotificacionApoderadoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
