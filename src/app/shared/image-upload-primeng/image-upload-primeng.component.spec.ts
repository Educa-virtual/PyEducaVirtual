import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImageUploadPrimengComponent } from './image-upload-primeng.component'

describe('ImageUploadPrimengComponent', () => {
    let component: ImageUploadPrimengComponent
    let fixture: ComponentFixture<ImageUploadPrimengComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImageUploadPrimengComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ImageUploadPrimengComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
