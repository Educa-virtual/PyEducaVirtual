import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import { AccordionModule } from 'primeng/accordion'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { PanelModule } from 'primeng/panel'
import {
    matAssignment,
    matDescription,
    matFactCheck,
    matForum,
    matQuiz,
    matVideocam,
} from '@ng-icons/material-icons/baseline'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { ActividadConfigPipe } from '@/app/sistema/aula-virtual/pipes/actividad-config.pipe'
import { MenuItem, MenuItemCommandEvent } from 'primeng/api'
import { TActividadActions } from '@/app/sistema/aula-virtual/interfaces/actividad-actions.iterface'

@Component({
    selector: 'app-actividad-row',
    standalone: true,
    imports: [
        CommonModule,
        AccordionModule,
        MenuModule,
        PanelModule,
        ButtonModule,
        IconComponent,
        ActividadConfigPipe,
    ],
    templateUrl: './actividad-row.component.html',
    styleUrl: './actividad-row.component.scss',
    providers: [
        provideIcons({
            matFactCheck,
            matQuiz,
            matAssignment,
            matDescription,
            matForum,
            matVideocam,
        }),
    ],
})
export class ActividadRowComponent implements OnInit {
    @Input({ required: true }) actividad: IActividad
    @Output() actionSelected = new EventEmitter<{
        actividad: IActividad
        action: TActividadActions
    }>()

    public accionesActividad: MenuItem[] | undefined

    ngOnInit() {
        // todo: cambiar acciones por actividad y no en general
        this.accionesActividad = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: (event: MenuItemCommandEvent) => {
                    event.originalEvent.stopPropagation()
                    this.actionSelected.emit({
                        actividad: this.actividad,
                        action: 'EDITAR',
                    })
                },
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: (event: MenuItemCommandEvent) => {
                    event.originalEvent.stopPropagation()
                    this.actionSelected.emit({
                        actividad: this.actividad,
                        action: 'ELIMINAR',
                    })
                },
            },
            {
                label: 'Ver',
                icon: 'pi pi-eye',
                command: (event: MenuItemCommandEvent) => {
                    event.originalEvent.stopPropagation()
                    this.actionSelected.emit({
                        actividad: this.actividad,
                        action: 'VER',
                    })
                },
            },
        ]
    }
}
