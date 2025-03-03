import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BackupBdComponent } from './backup-bd.component'

describe('BackupBdComponent', () => {
    let component: BackupBdComponent
    let fixture: ComponentFixture<BackupBdComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BackupBdComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(BackupBdComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
