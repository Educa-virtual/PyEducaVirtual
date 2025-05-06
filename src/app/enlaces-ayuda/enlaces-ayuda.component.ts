import { Component, OnInit } from '@angular/core'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { DomSanitizer } from '@angular/platform-browser'
import { Message } from 'primeng/api'
import { MessagesModule } from 'primeng/messages'
import { AccordionModule } from 'primeng/accordion'
import { ToolbarModule } from 'primeng/toolbar'
import { EnlacesAyuda } from './config/enlaces-ayuda'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { ListboxModule } from 'primeng/listbox'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import * as tiposDePerfiles from '../../app/servicios/seg/tiposPerfiles'
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal/confirm-modal.component'
import { ConfirmationModalService } from '../shared/confirm-modal/confirmation-modal.service'
import { DialogModule } from 'primeng/dialog'
import { CheckboxModule } from 'primeng/checkbox'
import { PickListModule } from 'primeng/picklist'
import { DropdownModule } from 'primeng/dropdown'
import { AccordionPanelComponent } from '../shared/accordion/accordion-panel/accordion-panel.component'
import {
    accordionOptions,
    accordionSections,
    AccordionViewComponent,
} from '../shared/accordion/accordion-view/accordion-view.component'
import { CommonModule } from '@angular/common'
@Component({
    selector: 'app-enlaces-ayuda',
    standalone: true,
    imports: [
        CommonModule,
        ContainerPageComponent,
        ConfirmModalComponent,
        AccordionPanelComponent,
        AccordionViewComponent,
        PickListModule,
        DropdownModule,
        CardModule,
        CheckboxModule,
        OverlayPanelModule,
        ListboxModule,
        DialogModule,
        ButtonModule,
        MessagesModule,
        AccordionModule,
        ToolbarModule,
    ],
    templateUrl: './enlaces-ayuda.component.html',
    styleUrl: './enlaces-ayuda.component.scss',
})
export class EnlacesAyudaComponent implements OnInit {
    messages: Message[] | undefined
    sidebarVisible: boolean = false
    isOrderState
    optionsSections: accordionSections = {
        isOrderActivity: false,
        typeOrder: 'cancelar',
    }

    optionsAccordion: accordionOptions = {
        isOrderActivity: false,
        typeOrder: 'cancelar',
    }

    dialogVisibles = {
        nuevaSeccion: false,
        nuevoVideo: false,
    }

    enlaces = [
        {
            title: 'INSTRUCTIVO PARA DOCENTES Y DIRECTORES 1 - ERE',
            content: [
                {
                    title: 'Bienvenida al curso',
                    description:
                        'Video de bienvenida y presentación del instructor.',
                    img: 'https://i.ytimg.com/vi/7o_oeT7C-3Y/hqdefault.jpg',
                },
                {
                    title: 'Configuración del entorno de trabajo',
                    description:
                        'Explicación paso a paso para instalar herramientas necesarias.',
                    img: 'https://i.ytimg.com/vi/7o_oeT7C-3Y/hqdefault.jpg',
                },
                {
                    title: 'Primeros pasos con la herramienta/lenguaje',
                    description:
                        'Ejercicio práctico simple para familiarizarse.',
                    img: 'https://i.ytimg.com/vi/7o_oeT7C-3Y/hqdefault.jpg',
                },
            ],
        },
        {
            title: 'INSTRUCTIVO PARA DOCENTES Y DIRECTORES 2 - ERE',
            content: [
                {
                    title: 'Bienvenida al curso',
                    description:
                        'Video de bienvenida y presentación del instructor.',
                    img: 'https://i.ytimg.com/vi/7o_oeT7C-3Y/hqdefault.jpg',
                },
                {
                    title: 'Configuración del entorno de trabajo',
                    description:
                        'Explicación paso a paso para instalar herramientas necesarias.',
                    img: 'https://i.ytimg.com/vi/7o_oeT7C-3Y/hqdefault.jpg',
                },
                {
                    title: 'Primeros pasos con la herramienta/lenguaje',
                    description:
                        'Ejercicio práctico simple para familiarizarse.',
                    img: 'https://i.ytimg.com/vi/7o_oeT7C-3Y/hqdefault.jpg',
                },
            ],
        },
        {
            title: 'INSTRUCTIVO PARA DOCENTES Y DIRECTORES 3 - ERE',
            content: [
                {
                    title: 'Bienvenida al curso',
                    description:
                        'Video de bienvenida y presentación del instructor.',
                    img: 'https://i.ytimg.com/vi/7o_oeT7C-3Y/hqdefault.jpg',
                },
                {
                    title: 'Configuración del entorno de trabajo',
                    description:
                        'Explicación paso a paso para instalar herramientas necesarias.',
                    img: 'https://i.ytimg.com/vi/7o_oeT7C-3Y/hqdefault.jpg',
                },
                {
                    title: 'Primeros pasos con la herramienta/lenguaje',
                    description:
                        'Ejercicio práctico simple para familiarizarse.',
                    img: 'https://i.ytimg.com/vi/7o_oeT7C-3Y/hqdefault.jpg',
                },
            ],
        },
    ]

    perfiles = Object.entries(tiposDePerfiles).map(([key, value]) => ({
        name: key.replaceAll('_', ' '),
        code: value,
    }))

    sourcePerfiles = []

    enlacesAyuda

    constructor(
        public sanitizer: DomSanitizer,
        private enlacesAyudaService: EnlacesAyuda,
        private dialog: ConfirmationModalService
        // private dialog: Modal
    ) {}

    ngOnInit() {
        this.messages = [{ severity: 'info', detail: 'Videos de Seguridad' }]

        this.enlacesAyudaService.getEnlacesAyuda().subscribe({
            next: (enlacesAyuda) => {
                this.enlacesAyuda = enlacesAyuda
            },
            error: (error) => {
                console.error('Error loading enlaces ayuda:', error)
            },
        })
    }

    openModal() {
        this.dialog.openConfirm({
            header: 'd',
        })
    }
}
