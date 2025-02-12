import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { EventEmitter, Output } from '@angular/core'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { StepsModule } from 'primeng/steps'
import { Subscription } from 'rxjs'
import { FormBuilder } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { CompartirMatriculasService } from '../../services/compartir.matriculas.service'

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
        private compartirMatriculasService: CompartirMatriculasService
    ) {}

    ngOnInit() {
        this.iEstudianteId = this.compartirMatriculasService.getiEstudianteId()
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
                label: 'Discapacidad y otras Condiciones',
                routerLink: 'discapacidad',
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
            accion: '',
            class: 'p-button-primary',
        },
    ]

    inicio() {
        this.router.navigate(['estudiante']) // Navega a DatosComponent
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
        this.compartirMatriculasService.clearData()
    }

    setActiveIndexSteps(index: string = '0') {
        return index ?? this.compartirMatriculasService.getActiveIndex()
    }
}
