import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChild,
} from '@angular/core'
import { AccordionPanelComponent } from '../accordion-panel/accordion-panel.component'
import * as tiposDePerfiles from '@/app/servicios/seg/tiposPerfiles'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip'
import { SplitButtonModule } from 'primeng/splitbutton'
import { ListboxModule } from 'primeng/listbox'
import { SpeedDialModule } from 'primeng/speeddial'
import { MenubarModule } from 'primeng/menubar'
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel'
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragPlaceholder,
    CdkDropList,
    moveItemInArray,
} from '@angular/cdk/drag-drop'

export interface accordionSections {
    isOrderActivity: boolean
    typeOrder: 'order' | 'guardar' | 'cancelar'
}

export interface accordionOptions {
    isOrderActivity: boolean
    typeOrder: 'guardar' | 'cancelar'
}

interface action {
    labelTooltip?: string
    icon: string
    type: 'order' | 'actions'

    class: string
}

@Component({
    selector: 'app-accordion-view',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
        SplitButtonModule,
        ListboxModule,
        TooltipModule,
        SpeedDialModule,
        MenubarModule,
        OverlayPanelModule,
        CdkDropList,
        CdkDrag,
        CdkDragPlaceholder,
    ],
    templateUrl: './accordion-view.component.html',
    styleUrl: './accordion-view.component.scss',
})
export class AccordionViewComponent implements AfterViewInit {
    perfilesFilter(perfilesActivos: number[]): string {
        return this.perfiles
            .filter((valor) => perfilesActivos.includes(valor.code))
            .map((valor) => valor.name) // <-- extraemos solo los nombres
            .join(', ') // <-- los convertimos a un solo string
    }

    accordions
    panelOrder: number[] = []
    perfiles = Object.entries(tiposDePerfiles).map(([key, value]) => ({
        name: key.replaceAll('_', ' '),
        code: value,
    }))

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(
            this.panelOrder,
            event.previousIndex,
            event.currentIndex
        )
    }
    @ViewChild('op') overlayPanel!: OverlayPanel

    options = [{ name: 'Eliminar', code: 'NY', icon: 'pi pi-trash' }]
    @ViewChild('overlayPanel') overlay!: OverlayPanel

    @ContentChildren(AccordionPanelComponent)
    accordionsPanels!: QueryList<AccordionPanelComponent>

    @Input() activeIndex: number = 0
    @Input() type: 'draggable' | 'template'
    @Output() accionBtnItem: EventEmitter<{ accion: any; item: any }> =
        new EventEmitter()

    private originalContents: any[] = []

    @Input() set optionsAccordion(value: accordionOptions) {
        const prev = this._optionsAccordion
        this._optionsAccordion = value

        if (!this.originalContents?.length && this.accordionsPanels?.length) {
            this.originalContents = this.accordionsPanels.map((panel) =>
                structuredClone(panel.contents)
            )
        }

        if (!value.isOrderActivity) {
            this.accordionsPanels?.forEach((panel) => {
                panel.optionsPanel.order = value.isOrderActivity
            })
        }

        switch (value.typeOrder) {
            case 'guardar':
                break
            default:
                this.accordionsPanels?.forEach((panel, index) => {
                    panel.optionsPanel.order = value.isOrderActivity
                    panel.contents = structuredClone(
                        this.originalContents[index]
                    )
                })

                break
        }

        console.log('optionsAccordion cambió (setter):', prev, '->', value)
    }

    get optionsAccordion() {
        console.log('this._optionsSections')
        console.log(this._optionsSections)

        return this._optionsAccordion
    }
    _optionsAccordion: accordionOptions = {
        isOrderActivity: false,
        typeOrder: 'cancelar',
    }

    originalPanelOrder

    @Input() set optionsSections(value: any) {
        this.cdr.detectChanges() // 🔧 Fuerza actualización de la vista
        this._optionsSections = value

        if (this._optionsSections.isOrderActivity) {
            this.accordionsPanels.forEach((panel) => {
                panel.optionsPanel.expand = false
            })

            // Guardamos el orden original solo si aún no se ha guardado
            if (!this.originalPanelOrder?.length && this.panelOrder?.length) {
                this.originalPanelOrder = [...this.panelOrder] // copia profunda no es necesaria con primitivos
            }

            // También podrías guardar los contenidos originales, si lo necesitas
            // if (!this.originalContents?.length && this.panelOrder?.length) {
            //     this.originalContents = this.panelOrder.map((i) =>
            //         structuredClone(this.accordionsPanels.get(i)?.contents)
            //     )
            // }
        }

        // Restaurar orden y/o contenido según el tipo de acción
        switch (value.typeOrder) {
            case 'guardar':
                // Aquí podrías aplicar lógica para guardar en backend, etc.
                if (Array.isArray(this.panelOrder)) {
                    this.originalPanelOrder = [...this.panelOrder]

                    // Si también guardas contenidos (descomenta si lo usas)
                    // this.originalContents = this.panelOrder.map(i =>
                    //     structuredClone(this.accordionsPanels.get(i)?.contents)
                    // );
                }

                break

            default:
                if (Array.isArray(this.originalPanelOrder)) {
                    this.panelOrder = [...this.originalPanelOrder]

                    if (this.originalContents?.length) {
                        this.panelOrder.forEach((i, index) => {
                            const panel = this.accordionsPanels.get(i)
                            if (panel) {
                                panel.contents = structuredClone(
                                    this.originalContents[index]
                                )
                            }
                        })
                    }
                }

                break
        }
    }

    get optionsSections() {
        return this._optionsSections
    }

    _optionsSections = {
        isOrderActivity: false,
        typeOrder: 'cancelar',
    }

    @Input() actions: action[] = [
        {
            labelTooltip: 'Ordenar videos',
            icon: 'pi pi-list',
            type: 'order',
            class: 'p-button-rounded p-button-secondary p-button-text',
        },
        {
            icon: 'pi pi-ellipsis-h',
            type: 'actions',
            class: 'p-button-rounded p-button-secondary p-button-text',
        },
    ]

    constructor(private cdr: ChangeDetectorRef) {}

    ngAfterViewInit(): void {
        this.accordionsPanels.changes.subscribe(() => {
            console.log(
                'Cambió la proyección de paneles:',
                this.accordionsPanels
            )

            this.panelOrder = this.accordionsPanels.toArray().map((_, i) => i)
        })
    }

    toggleAccordions(AccordionIndex) {
        if (this._optionsSections.isOrderActivity) return

        this._optionsAccordion.isOrderActivity = this.accordionsPanels.some(
            (panel) => panel.optionsPanel.order
        )

        if (this._optionsAccordion.isOrderActivity) return

        this.accordionsPanels.forEach((panel, i) => {
            panel.optionsPanel.expand =
                i === AccordionIndex ? !panel.optionsPanel.expand : false
        })
    }

    btnActions({
        tab,
        action,
    }: {
        tab: AccordionPanelComponent
        action: action
    }) {
        switch (action.type) {
            case 'order':
                tab.optionsPanel.expand = true
                this.accordionsPanels.forEach((panel) => {
                    panel.optionsPanel.order = true
                    if (panel != tab) {
                        panel.optionsPanel.expand = false
                    }
                })
                this._optionsAccordion.isOrderActivity = tab.optionsPanel.order
                this.originalContents = this.accordionsPanels.map((panel) =>
                    structuredClone(panel.contents)
                )
                console.log('Se ha emitido', tab.optionsPanel.order)

                break
            case 'actions':
                this.overlay.toggle(event)
                console.log('action.type')
                console.log(action.type)

                break

            default:
                break
        }
        console.log(tab, action)
    }

    btnOptionsSections({ tab, option }) {
        console.log('tab, option')
        console.log(tab, option)
        // this.accordionsPanels.forEach((panel) => {
        //     panel.optionsPanel.visible = false
        // })

        switch (option.name) {
            case 'Eliminar':
                tab.optionsPanel.visible = false

                // this.accordionsPanels?.forEach((panel) => {
                //     panel.optionsPanel.expand = false
                //     if (panel == tab) {
                //         console.log('tab');
                //         console.log(tab);
                //     }
                // })

                break

            default:
                break
        }
    }
}
