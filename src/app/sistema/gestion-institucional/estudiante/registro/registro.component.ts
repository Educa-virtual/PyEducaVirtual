import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { EventEmitter, Output } from '@angular/core'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { StepsModule } from 'primeng/steps'
import { Subscription } from 'rxjs'
import { FormBuilder } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { CompartirEstudianteService } from '../../services/compartir-estudiante.service'

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [ContainerPageComponent, StepsModule],
    providers: [MessageService],
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.scss',
})
export class RegistroComponent implements OnInit, OnDestroy {
    @Output() emitMode = new EventEmitter()
    subscription: Subscription
    items: MenuItem[]
    paises: Array<object>
    departamentos: Array<object>
    iEstudianteId: string
    iPersId: string

    routeLink = 0

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private compartirEstudianteService: CompartirEstudianteService
    ) {}

    ngOnInit() {
        this.iEstudianteId = this.compartirEstudianteService.getiEstudianteId()
        this.items = [
            {
                label: 'Datos del estudiante',
                routerLink: 'datos',
            },
            {
                label: 'Representante Legal',
                routerLink: 'representante',
                // disabled: !this.iEstudianteId,
            },
            {
                label: 'Familia',
                routerLink: 'familia',
                // disabled: !this.iEstudianteId,
            },
        ]
        this.setActiveIndexSteps()
    }

    actionsContainer = [
        {
            labelTooltip: 'Regresar',
            text: 'Regresar',
            icon: 'pi pi-arrow-left',
            accion: 'salir',
            class: 'p-button-primary',
        },
    ]

    inicio() {
        this.router.navigate(['/']) // Navega a inicio
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
        this.compartirEstudianteService.clearData()
    }

    setActiveIndexSteps(index: string = '0') {
        return index ?? this.compartirEstudianteService.getActiveIndex()
    }
}
