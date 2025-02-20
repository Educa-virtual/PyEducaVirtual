import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TreeViewPrimengComponent } from './tree-view-primeng.component'

describe('TreeViewPrimengComponent', () => {
    let component: TreeViewPrimengComponent
    let fixture: ComponentFixture<TreeViewPrimengComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TreeViewPrimengComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(TreeViewPrimengComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
