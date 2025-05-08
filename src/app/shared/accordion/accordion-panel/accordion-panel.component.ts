import { Component, Input, TemplateRef, ViewChild } from '@angular/core'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { ListboxModule } from 'primeng/listbox'
import { CommonModule } from '@angular/common'
import { trigger, state, style, animate, transition } from '@angular/animations'
import { matDragIndicator } from '@ng-icons/material-icons/baseline'
import { provideIcons } from '@ng-icons/core'
import { NgIconComponent } from '@ng-icons/core'
import { ButtonModule } from 'primeng/button'
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragPlaceholder,
    CdkDropList,
    moveItemInArray,
} from '@angular/cdk/drag-drop'

interface optionsPanel {
    expand: boolean
    order: boolean
    visible: boolean
    type: 'draggable' | 'template'
}

@Component({
    selector: 'app-accordion-panel',
    standalone: true,
    imports: [
        CommonModule,
        OverlayPanelModule,
        ListboxModule,
        NgIconComponent,
        ButtonModule,
        CdkDropList,
        CdkDrag,
        CdkDragPlaceholder,
    ],
    templateUrl: './accordion-panel.component.html',
    providers: [provideIcons({ matDragIndicator })],
    animations: [
        trigger('expandCollapse', [
            state(
                'collapsed',
                style({
                    height: '0px',
                    overflow: 'hidden',
                    padding: '0 1.5rem',
                    opacity: 0,
                })
            ),
            state(
                'expanded',
                style({
                    height: '*',
                    overflow: 'visible',
                    padding: '1.5rem',
                    opacity: 1,
                })
            ),
            transition('collapsed <=> expanded', [
                animate('300ms ease-in-out'),
            ]),
        ]),
    ],

    styleUrl: './accordion-panel.component.scss',
})
export class AccordionPanelComponent {
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.contents, event.previousIndex, event.currentIndex)
    }

    @Input() perfilesActives

    @Input() panelTitle = 'Panel'
    @Input() contents
    @Input() panels
    @Input() item: any
    @Input() set optionsPanel(value: optionsPanel) {
        const prev = this._optionsPanel

        this._optionsPanel = value
        console.log('optionsPanel cambió (setter):', prev, '->', value)
    }

    get optionsPanel() {
        return this._optionsPanel
    }
    _optionsPanel: optionsPanel = {
        expand: false,
        order: false,
        visible: true,
        type: 'draggable',
    }
    @ViewChild('template', { static: true }) content!: TemplateRef<any>

    options = [{ name: 'Eliminar', code: 'NY', icon: 'pi pi-trash' }]

    btnOptionsSections({ content, option }) {
        console.log('content, option')
        console.log(content, option)
        switch (option.name) {
            case 'Eliminar':
                console.log('content, option')
                console.log(content, option)

                break

            default:
                break
        }
    }
}
